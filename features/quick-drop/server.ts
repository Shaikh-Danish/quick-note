import type { z } from "zod";
import {
  createQuickDropDal,
  deleteQuickDropDal,
  getQuickDropByUrlDal,
} from "@/data-access/quick-drop";
import type { createQuickDropSchema } from "@/lib/schemas/quick-drop";

export function normalizeDropCode(code: string) {
  return code.trim().toUpperCase();
}

function generateUrlStr(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
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
  const expiresAt = new Date(
    Date.now() + payload.expiresInHours * 60 * 60 * 1000,
  );

  const drop = await createQuickDropDal({
    content: payload.content,
    url: urlStr,
    expiresAt,
    isBurnAfterRead: payload.isBurnAfterRead ?? true,
    userId,
  });

  return { url: drop.url, expiresAt: drop.expiresAt };
}

export async function fetchQuickDropFeature(url: string) {
  const code = normalizeDropCode(url);
  const drop = await getQuickDropByUrlDal(code);

  if (!drop) {
    throw new Error("Drop not found or has expired.");
  }

  if (drop.expiresAt < new Date()) {
    await deleteQuickDropDal(drop.id);
    throw new Error("Drop not found or has expired.");
  }

  return {
    content: drop.content,
    isBurnAfterRead: drop.isBurnAfterRead,
  };
}

export async function burnQuickDropFeature(url: string) {
  const code = normalizeDropCode(url);
  const drop = await getQuickDropByUrlDal(code);
  if (!drop) return;
  await deleteQuickDropDal(drop.id);
}
