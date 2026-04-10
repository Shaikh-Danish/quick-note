import type { z } from "zod";
import {
  createQuickDropDal,
  deleteQuickDropDal,
  getQuickDropByUrlDal,
} from "@/data-access/quick-drop";
import { decryptWithPassword, encryptWithPassword } from "@/lib/encryption";
import type { createQuickDropSchema } from "@/lib/schemas/quick-drop";

function generateUrlStr(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoiding ambiguous characters like O, 0, 1, I
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createQuickDropFeature(
  payload: z.infer<typeof createQuickDropSchema>,
  userId?: string,
) {
  const urlStr = generateUrlStr();
  // Encrypt the content using the generated url string as the password
  // This guarantees that the server only stores ciphertext unreadable without the url string
  const encryptedContent = encryptWithPassword(payload.content, urlStr);
  const expiresAt = new Date(
    Date.now() + payload.expiresInHours * 60 * 60 * 1000,
  );

  const drop = await createQuickDropDal({
    content: encryptedContent,
    url: urlStr,
    expiresAt,
    isBurnAfterRead: payload.isBurnAfterRead ?? true,
    userId,
  });

  return { url: drop.url, expiresAt: drop.expiresAt };
}

export async function fetchQuickDropFeature(url: string) {
  const drop = await getQuickDropByUrlDal(url);

  if (!drop) {
    throw new Error("Drop not found or has expired.");
  }

  // Check Expiry
  if (drop.expiresAt < new Date()) {
    await deleteQuickDropDal(drop.id);
    throw new Error("Drop not found or has expired.");
  }

  // Decrypt using the url string the user provided
  const decryptedContent = decryptWithPassword(drop.content, url);

  if (drop.isBurnAfterRead) {
    await deleteQuickDropDal(drop.id);
  }

  return { content: decryptedContent };
}
