import { z } from "zod";

export const generatePrintTokenSchema = z.object({
  noteId: z.string().uuid("Invalid Note ID format"),
  password: z.string().optional(),
});

export type GeneratePrintTokenSchema = z.infer<typeof generatePrintTokenSchema>;

export const printTokenResponseSchema = z.object({
  success: z.boolean(),
  url: z.string().url(),
});

export type PrintTokenResponse = z.infer<typeof printTokenResponseSchema>;

export const printDocResponseSchema = z.object({
  success: z.boolean(),
  title: z.string(),
  content: z.string().optional(),
  type: z.string(),
});

export type PrintDocResponse = z.infer<typeof printDocResponseSchema>;
