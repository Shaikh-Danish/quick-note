import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).optional(),
}).refine((data) => data.title || data.content, {
  message: "Either title or content must be provided",
  path: ["content"],
});

export type NoteSchema = z.infer<typeof noteSchema>;
