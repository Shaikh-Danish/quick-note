const DROP_KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const DROP_KEY_LENGTH = 6;

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function generateDropKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(DROP_KEY_LENGTH));
  return Array.from(bytes, (byte) => DROP_KEY_CHARS[byte % DROP_KEY_CHARS.length]).join(
    "",
  );
}

export function normalizeDropKey(key: string) {
  return key.trim().toUpperCase();
}

async function deriveAesKey(password: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptDropContent(plaintext: string, key: string) {
  const password = normalizeDropKey(key);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const cryptoKey = await deriveAesKey(password, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    new TextEncoder().encode(plaintext),
  );

  return [
    bytesToBase64(salt),
    bytesToBase64(iv),
    bytesToBase64(new Uint8Array(encrypted)),
  ].join(".");
}

export async function decryptDropContent(payload: string, key: string) {
  const password = normalizeDropKey(key);
  const [saltB64, ivB64, dataB64] = payload.split(".");
  if (!saltB64 || !ivB64 || !dataB64) {
    throw new Error("Invalid encrypted drop.");
  }

  try {
    const salt = base64ToBytes(saltB64);
    const iv = base64ToBytes(ivB64);
    const data = base64ToBytes(dataB64);
    const cryptoKey = await deriveAesKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data,
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error("Invalid key.");
  }
}
