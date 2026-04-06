"use server";

import { decryptWithPassword } from "@/lib/encryption";

export async function unlockNoteContent(encryptedContent: string, password: string) {
  try {
    const decrypted = decryptWithPassword(encryptedContent, password);
    return { success: true, content: decrypted };
  } catch (_) {
    return { success: false, error: "Invalid password." };
  }
}
