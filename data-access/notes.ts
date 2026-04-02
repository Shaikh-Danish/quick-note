import { prisma } from "@/lib/prisma";
import { encryptNoteContent, decryptNoteContent } from "@/lib/encryption";

export async function getUserNotes(userId: string) {
  try {
    const notes = await prisma.note.findMany({
      where: { userId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return notes.map((note) => ({
      ...note,
      content: decryptNoteContent(note.content, userId),
      tags: note.tags.map((t) => t.tag),
    }));
  } catch (error) {
    console.error("Data Access: Failed to fetch notes:", error);
    throw new Error("Failed to load notes from database");
  }
}

export async function createNote(
  userId: string,
  data: { title?: string; content?: string; tags?: string[] }
) {
  try {
    const encryptedContent = encryptNoteContent(data.content || "", userId);

    return await prisma.note.create({
      data: {
        title: data.title || "Untitled Note",
        content: encryptedContent,
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
