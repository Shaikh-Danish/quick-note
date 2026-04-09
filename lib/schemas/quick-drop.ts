import { z } from "zod";

export const createQuickDropSchema = z.object({
  content: z.string().min(1, "Content cannot be empty").max(10000, "Content is too long"),
  expiresInHours: z.number().int().min(1).max(168).default(24),
  isBurnAfterRead: z.boolean().default(true),
});

export const fetchQuickDropSchema = z.object({
  accessCode: z.string().length(6, "Access code must be exactly 6 characters").toUpperCase(),
});
