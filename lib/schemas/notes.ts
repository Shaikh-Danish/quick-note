import { z } from "zod";

export const NOTE_CATEGORIES = ["TEXT", "URL", "IMAGE", "DOCUMENT", "MARKDOWN"] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

/** Maps each category to its default MIME/content type */
export const CATEGORY_CONTENT_TYPES: Record<NoteCategory, string> = {
  TEXT: "text/plain",
  URL: "text/uri-list",
  IMAGE: "image/png",
  DOCUMENT: "application/pdf",
  MARKDOWN: "text/markdown",
};

/** Human-readable labels for display */
export const CATEGORY_LABELS: Record<NoteCategory, string> = {
  TEXT: "Text",
  URL: "URL",
  IMAGE: "Image",
  DOCUMENT: "Document",
  MARKDOWN: "Markdown",
};

export const noteCategorySchema = z.enum(NOTE_CATEGORIES);

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(15_000_000, "Content must be less than 15MB"),
  category: noteCategorySchema.default("TEXT"),
  contentType: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  isProtected: z.boolean().optional().default(false),
  password: z.string().optional(),
});

export type NoteSchema = z.infer<typeof noteSchema>;

/** Query params for listing notes */
export const notesQuerySchema = z.object({
  sort: z.enum(["latest", "most_used"]).default("latest"),
  category: noteCategorySchema.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type NotesQuery = z.infer<typeof notesQuerySchema>;
