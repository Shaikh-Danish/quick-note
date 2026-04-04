import crypto from "crypto";
import { env } from "@/lib/env";

const ALGORITHM = "aes-256-cbc";

/**
 * Derives a consistent 32-byte key from the environment secret and user ID.
 * This represents proper symmetric backend encryption tied to both the system
 * environment variables (validated via T3 Env) and the user's specific ID.
 */
function getKey(userId: string): Buffer {
  return crypto.scryptSync(userId + env.BETTER_AUTH_SECRET, "salt", 32);
}

/**
 * Encrypts purely the text using AES-256-CBC.
 */
export function encryptString(text: string, userId: string): string {
  const iv = crypto.randomBytes(16);
  const key = getKey(userId);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts purely the text using AES-256-CBC.
 */
export function decryptString(encryptedText: string, userId: string): string {
  if (!encryptedText || !encryptedText.includes(":")) return encryptedText;

  const [ivStr, encryptedStr] = encryptedText.split(":");
  if (!ivStr || !encryptedStr) return encryptedText;

  const iv = Buffer.from(ivStr, "hex");
  const key = getKey(userId);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  try {
    let decrypted = decipher.update(encryptedStr, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "Encrypted data could not be parsed.";
  }
}
