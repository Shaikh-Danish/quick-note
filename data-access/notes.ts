import { decryptString, encryptString } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";

export async function getUserNotes(
  userId: string,
  sortBy: "latest" | "most_copied" = "latest",
) {
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
      orderBy:
        sortBy === "most_copied"
          ? { copiedCount: "desc" }
          : { createdAt: "desc" },
    });

    return notes.map((note) => ({
      ...note,
      title: decryptString(note.title, userId),
      content: decryptString(note.content, userId),
      tags: note.tags.map((t) => t.tag),
    }));
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
  data: { title?: string; content?: string; tags?: string[] },
) {
  try {
    const encryptedTitle = encryptString(data.title || "Untitled Note", userId);
    const encryptedContent = encryptString(data.content || "", userId);

    return await prisma.note.create({
      data: {
        title: encryptedTitle,
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
