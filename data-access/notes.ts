import { decryptString, encryptString } from "@/lib/encryption";
import type { NoteCategory as PrismaNoteCategory } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { NoteCategory, NotesQuery } from "@/lib/schemas/notes";

export interface NoteResult {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  contentType: string | null;
  createdAt: Date;
  updatedAt: Date;
  copiedCount: number;
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
          query.sort === "most_copied"
            ? { copiedCount: "desc" }
            : { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.note.count({ where }),
    ]);

    let decryptedNotes = notes.map((note) => ({
      id: note.id,
      title: decryptString(note.title, userId),
      content: decryptString(note.content, userId),
      category: note.category as NoteCategory,
      contentType: note.contentType
        ? decryptString(note.contentType, userId)
        : null,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      copiedCount: note.copiedCount,
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
        copiedCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Data Access: Failed to increment copy count:", error);
    throw new Error("Failed to update copy count");
  }
}

export async function createNote(
  userId: string,
  data: {
    title: string;
    content: string;
    category?: NoteCategory;
    contentType?: string;
    tags?: string[];
  },
) {
  try {
    const encryptedTitle = encryptString(data.title, userId);
    const encryptedContent = encryptString(data.content, userId);
    const encryptedContentType = data.contentType
      ? encryptString(data.contentType, userId)
      : null;

    return await prisma.note.create({
      data: {
        title: encryptedTitle,
        content: encryptedContent,
        category: (data.category || "TEXT") as PrismaNoteCategory,
        contentType: encryptedContentType,
        userId: userId,
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
    return await prisma.note.delete({
      where: { id: noteId, userId: userId },
    });
  } catch (error) {
    console.error("Data Access: Failed to delete note:", error);
    throw new Error("Failed to delete note from database");
  }
}
