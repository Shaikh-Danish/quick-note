import { prisma } from "@/lib/prisma";

/**
 * Creates a secure, one-time-use print token for a specific note.
 * Returns the unique token UUID.
 */
export async function createPrintToken(
  noteId: string, 
  userId: string, 
  accessKey?: string
): Promise<string> {
  // Verify ownership before generating token
  const note = await prisma.note.findUnique({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new Error("Note not found or unauthorized");
  }

  // Token expires in 5 minutes (absolute maximum)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const newRecord = await prisma.securePrintToken.create({
    data: {
      noteId,
      expiresAt,
      accessKey,
    },
    select: {
      token: true,
    },
  });

  return newRecord.token;
}

/**
 * Retrieves a valid print token and its associated note details.
 * Implements the "Session Window" logic:
 * - If first accessed, updates firstAccessedAt and remains valid for 2 mins from now.
 * - Otherwise, checks if current time is within both absolute and session limits.
 */
export async function getValidPrintToken(token: string) {
  const now = new Date();

  // 1. Initial lookup
  const record = await prisma.securePrintToken.findUnique({
    where: { token },
    include: {
      note: {
        include: {
          user: true
        }
      },
    },
  });

  if (!record || record.isUsed) return null;

  // 2. Check absolute expiry (5 mins)
  if (now > record.expiresAt) {
    await prisma.securePrintToken.update({
      where: { id: record.id },
      data: { isUsed: true },
    });
    return null;
  }

  // 3. Handle First Access & Session Window (2 mins)
  if (!record.firstAccessedAt) {
    // First time opening the link - start the 2-min countdown
    const updatedRecord = await prisma.securePrintToken.update({
      where: { id: record.id },
      data: { firstAccessedAt: now },
      include: {
        note: {
          include: {
            user: true
          }
        },
      },
    });
    return updatedRecord;
  } else {
    // Already accessed - check if the 2-min window has passed
    const sessionExpiry = new Date(record.firstAccessedAt.getTime() + 2 * 60 * 1000);
    if (now > sessionExpiry) {
      await prisma.securePrintToken.update({
        where: { id: record.id },
        data: { isUsed: true },
      });
      return null;
    }
  }

  return record;
}

/**
 * Marks a token as strictly used (manual burn).
 */
export async function invalidatePrintToken(tokenId: string) {
  return prisma.securePrintToken.update({
    where: { id: tokenId },
    data: { isUsed: true },
  });
}
