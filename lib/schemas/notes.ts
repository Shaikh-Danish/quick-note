import { z } from "zod";

export const NOTE_TYPES = ["TEXT", "URL", "IMAGE", "DOCUMENT", "MARKDOWN"] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

/** Maps each type to its default MIME/content type */
export const TYPE_CONTENT_TYPES: Record<NoteType, string> = {
  TEXT: "text/plain",
  URL: "text/uri-list",
  IMAGE: "image/png",
  DOCUMENT: "application/pdf",
  MARKDOWN: "text/markdown",
};

/** Human-readable labels for display */
export const TYPE_LABELS: Record<NoteType, string> = {
  TEXT: "Text",
  URL: "URL",
  IMAGE: "Image",
  DOCUMENT: "Document",
  MARKDOWN: "Markdown",
};

/** Aliases for backward compatibility during transition from Category to Type */
export type NoteCategory = NoteType;
export const CATEGORY_LABELS = TYPE_LABELS;
export const NOTE_CATEGORIES = NOTE_TYPES;

export const noteTypeSchema = z.enum(NOTE_TYPES);

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(50_000_000, "Content must be less than 50MB"),
  type: noteTypeSchema.default("TEXT"),
  category: z.string().optional(),
  contentType: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  isProtected: z.boolean().optional().default(false),
  password: z.string().optional(),
});

export type NoteSchema = z.infer<typeof noteSchema>;

/** Query params for listing notes */
export const notesQuerySchema = z.object({
  sort: z.enum(["latest", "most_used"]).default("latest"),
  type: noteTypeSchema.optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type NotesQuery = z.infer<typeof notesQuerySchema>;
