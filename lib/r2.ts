import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import { env } from "@/lib/env";

const FILE_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // GCM standard
const AUTH_TAG_LENGTH = 16;

/**
 * Singleton R2 client (S3-compatible).
 */
let _r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!_r2Client) {
    _r2Client = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return _r2Client;
}

/**
 * Derives a 32-byte key for file encryption from userId + server secret.
 */
function getFileKey(userId: string): Buffer {
  return crypto.scryptSync(userId + env.BETTER_AUTH_SECRET, "r2-file-salt", 32);
}

/**
 * Encrypts raw file bytes using AES-256-GCM.
 * Returns: [12-byte IV | 16-byte auth tag | ciphertext]
 */
function encryptFileBuffer(buffer: Buffer, userId: string): Buffer {
  const key = getFileKey(userId);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(FILE_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Pack: IV + authTag + ciphertext
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Decrypts file bytes encrypted with encryptFileBuffer.
 */
function decryptFileBuffer(encryptedBuffer: Buffer, userId: string): Buffer {
  const key = getFileKey(userId);

  const iv = encryptedBuffer.subarray(0, IV_LENGTH);
  const authTag = encryptedBuffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = encryptedBuffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(FILE_ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

/**
 * Generates a unique R2 object key for a file.
 */
function generateFileKey(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString("hex");
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `notes/${userId}/${timestamp}-${random}-${sanitized}`;
}

/**
 * Uploads an encrypted file to R2.
 * Returns the R2 object key.
 */
export async function uploadFileToR2(
  fileBuffer: Buffer,
  userId: string,
  originalName: string,
  contentType: string,
): Promise<{ fileKey: string; fileSize: number }> {
  const r2 = getR2Client();
  const fileKey = generateFileKey(userId, originalName);

  const encrypted = encryptFileBuffer(fileBuffer, userId);

  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: fileKey,
      Body: encrypted,
      ContentType: "application/octet-stream", // Always octet-stream since encrypted
      Metadata: {
        "original-content-type": contentType,
        "original-size": String(fileBuffer.length),
      },
    }),
  );

  return { fileKey, fileSize: fileBuffer.length };
}

/**
 * Downloads and decrypts a file from R2.
 * Returns the decrypted file buffer.
 */
export async function downloadFileFromR2(
  fileKey: string,
  userId: string,
): Promise<Buffer> {
  const r2 = getR2Client();

  const response = await r2.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: fileKey,
    }),
  );

  if (!response.Body) {
    throw new Error("Empty response from R2");
  }

  const encryptedBuffer = Buffer.from(await response.Body.transformToByteArray());
  return decryptFileBuffer(encryptedBuffer, userId);
}

/**
 * Deletes a file from R2.
 */
export async function deleteFileFromR2(fileKey: string): Promise<void> {
  const r2 = getR2Client();

  await r2.send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: fileKey,
    }),
  );
}
