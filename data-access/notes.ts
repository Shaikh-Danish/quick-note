import { decryptString, encryptString, encryptWithPassword } from "@/lib/encryption";
import type { NoteCategory as PrismaNoteCategory } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { uploadFileToR2, deleteFileFromR2 } from "@/lib/r2";
import type { NoteCategory, NotesQuery } from "@/lib/schemas/notes";

export interface NoteResult {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  contentType: string | null;
  fileKey: string | null;
  fileSize: number | null;
  createdAt: Date;
  updatedAt: Date;
  useCount: number;
  isProtected: boolean;
  tags: { id: string; name: string }[];
}

export interface PaginatedNotes {
  notes: NoteResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getUserNotes(
  userId: string,
  query: NotesQuery,
): Promise<PaginatedNotes> {
  try {
    const where: Record<string, unknown> = { userId };

    if (query.category) {
      where.category = query.category as PrismaNoteCategory;
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy:
          query.sort === "most_used"
            ? { useCount: "desc" }
            : { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.note.count({ where }),
    ]);

    let decryptedNotes = notes.map((note) => ({
      id: note.id,
      title: decryptString(note.title, userId),
      // For file-based notes, content is just a placeholder — actual file is in R2
      content: note.fileKey ? "" : decryptString(note.content, userId),
      category: note.category as NoteCategory,
      contentType: note.contentType
        ? decryptString(note.contentType, userId)
        : null,
      fileKey: note.fileKey,
      fileSize: note.fileSize,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      useCount: note.useCount,
      isProtected: note.isProtected,
      tags: note.tags.map((t) => t.tag),
    }));

    // Search is applied post-decryption since content is encrypted
    let filteredTotal = total;
    if (query.search) {
      const term = query.search.toLowerCase();
      decryptedNotes = decryptedNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          n.content.toLowerCase().includes(term),
      );
      filteredTotal = decryptedNotes.length;
    }

    return {
      notes: decryptedNotes,
      total: filteredTotal,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(filteredTotal / query.limit),
    };
  } catch (error) {
    console.error("Data Access: Failed to fetch notes:", error);
    throw new Error("Failed to load notes from database");
  }
}

export async function incrementNoteCopyCount(userId: string, noteId: string) {
  try {
    return await prisma.note.update({
      where: { id: noteId, userId: userId },
      data: {
        useCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Data Access: Failed to increment copy count:", error);
    throw new Error("Failed to update copy count");
  }
}

/**
 * Creates a note. For file-based notes (IMAGE/DOCUMENT), uploads the file
 * to R2 with encryption. For text notes, encrypts content in the DB.
 */
export async function createNote(
  userId: string,
  data: {
    title: string;
    content: string;
    category?: NoteCategory;
    contentType?: string;
    tags?: string[];
    isProtected?: boolean;
    password?: string;
    // File upload fields (for IMAGE/DOCUMENT)
    fileBuffer?: Buffer;
    fileName?: string;
  },
) {
  try {
    const encryptedTitle = encryptString(data.title, userId);
    const encryptedContentType = data.contentType
      ? encryptString(data.contentType, userId)
      : null;

    let encryptedContent: string;
    let fileKey: string | null = null;
    let fileSize: number | null = null;

    // File-based notes → upload to R2
    if (data.fileBuffer && data.fileName) {
      const r2Result = await uploadFileToR2(
        data.fileBuffer,
        userId,
        data.fileName,
        data.contentType || "application/octet-stream",
      );
      fileKey = r2Result.fileKey;
      fileSize = r2Result.fileSize;
      // Store a placeholder in content (DB doesn't hold the file data)
      encryptedContent = encryptString("r2-file", userId);
    } else {
      // Text-based notes → encrypt content in DB
      let innerContent = data.content;
      if (data.isProtected && data.password && data.password.trim() !== "") {
        innerContent = encryptWithPassword(data.content, data.password);
      }
      encryptedContent = encryptString(innerContent, userId);
    }

    return await prisma.note.create({
      data: {
        title: encryptedTitle,
        content: encryptedContent,
        category: (data.category || "TEXT") as PrismaNoteCategory,
        contentType: encryptedContentType,
        fileKey,
        fileSize,
        userId: userId,
        isProtected: data.isProtected ?? false,
        tags: {
          create: (data.tags || []).map((t) => ({
            tag: {
              connectOrCreate: {
                where: { name: t },
                create: { name: t },
              },
            },
          })),
        },
      },
    });
  } catch (error) {
    console.error("Data Access: Failed to create note:", error);
    throw new Error("Failed to create note in database");
  }
}

export async function deleteNote(userId: string, noteId: string) {
  try {
    // Fetch the note first to check for R2 file
    const note = await prisma.note.findUnique({
      where: { id: noteId, userId },
      select: { fileKey: true },
    });

    // Delete the note from DB
    const deleted = await prisma.note.delete({
      where: { id: noteId, userId: userId },
    });

    // Clean up R2 file if it exists
    if (note?.fileKey) {
      try {
        await deleteFileFromR2(note.fileKey);
      } catch (r2Error) {
        console.error("Failed to delete R2 file (note already deleted):", r2Error);
      }
    }

    return deleted;
  } catch (error) {
    console.error("Data Access: Failed to delete note:", error);
    throw new Error("Failed to delete note from database");
  }
}
