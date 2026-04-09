import type { z } from "zod";
import {
  createQuickDropDal,
  deleteQuickDropDal,
  getQuickDropByCodeDal,
} from "@/data-access/quick-drop";
import { decryptWithPassword, encryptWithPassword } from "@/lib/encryption";
import type { createQuickDropSchema } from "@/lib/schemas/quick-drop";

function generateCode(): string {
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
  const code = generateCode();
  // Encrypt the content using the generated access code as the password
  // This guarantees that the server only stores ciphertext unreadable without the code
  const encryptedContent = encryptWithPassword(payload.content, code);
  const expiresAt = new Date(
    Date.now() + payload.expiresInHours * 60 * 60 * 1000,
  );

  const drop = await createQuickDropDal({
    content: encryptedContent,
    accessCode: code,
    expiresAt,
    isBurnAfterRead: payload.isBurnAfterRead,
    userId,
  });

  return { accessCode: drop.accessCode, expiresAt: drop.expiresAt };
}

export async function fetchQuickDropFeature(accessCode: string) {
  const drop = await getQuickDropByCodeDal(accessCode);

  if (!drop) {
    throw new Error("Drop not found or has expired.");
  }

  // Check Expiry
  if (drop.expiresAt < new Date()) {
    await deleteQuickDropDal(drop.id);
    throw new Error("Drop not found or has expired.");
  }

  // Decrypt using the code the user provided
  const decryptedContent = decryptWithPassword(drop.content, accessCode);

  if (drop.isBurnAfterRead) {
    await deleteQuickDropDal(drop.id);
  }

  return { content: decryptedContent };
}
