"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

import type { Note } from "@/features/notes/client";
import type { NoteCategory } from "@/lib/schemas/notes";
import { CATEGORY_LABELS } from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";
import { DeleteNoteDialog } from "./delete-note-dialog";
import { ProtectedNoteForm } from "./protected-note-form";

const CATEGORY_ICONS: Record<NoteCategory, keyof typeof Icons> = {
  TEXT: "textT",
  URL: "link",
  IMAGE: "image",
  DOCUMENT: "file",
  MARKDOWN: "article",
};

interface NoteCardProps {
  note: Note;
  onCopy?: (note: Note) => void;
  onDownload?: (note: Note) => void;
  onDelete?: (note: Note) => void;
}

export function NoteCard({
  note,
  onCopy,
  onDownload,
  onDelete,
}: NoteCardProps) {
  const [copied, setCopied] = useState(false);
  const [unlockedContent, setUnlockedContent] = useState<string | null>(null);

  const handleCopy = () => {
    onCopy?.({ ...note, content: unlockedContent || note.content });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const contentToDownload = unlockedContent || note.content;
    const a = document.createElement("a");
    a.href = contentToDownload;
    const ext =
      note.contentType?.split("/")[1] ||
      (note.category === "IMAGE" ? "png" : "pdf");
    a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onDownload?.(note);
  };

  const CategoryIcon = Icons[CATEGORY_ICONS[note.category]];

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between p-4 transition-all duration-200 min-h-[140px]",
        "bg-card border border-border/30 hover:border-border",
        "shadow-none hover:shadow-sm",
      )}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/10 group-hover:bg-primary transition-colors duration-200" />

      <div className="space-y-3 pl-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            {/* Category badge */}
            <Badge
              variant="outline"
              className="rounded-none px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black border-border/30 bg-muted/30 text-muted-foreground/50 gap-1"
            >
              <CategoryIcon size={10} weight="bold" />
              {CATEGORY_LABELS[note.category]}
            </Badge>
            {/* Tags */}
            {note.tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="rounded-none px-1.5 py-0 text-[8px] uppercase tracking-widest font-black border-border/30 bg-transparent text-muted-foreground/40"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <DeleteNoteDialog note={note} onDelete={onDelete} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wide text-foreground/90 leading-tight">
            {note.title}
          </h3>
          {note.isProtected && unlockedContent === null ? (
            <ProtectedNoteForm note={note} onSuccess={setUnlockedContent} />
          ) : note.category === "IMAGE" ? (
            <div className="mt-2 flex justify-center bg-muted/20 border border-border/50 max-h-[200px] overflow-hidden rounded-sm">
              <Image
                src={unlockedContent || note.content}
                alt={note.title}
                width={800}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          ) : note.category === "DOCUMENT" ? (
            <div className="mt-2 flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/50 rounded-sm min-h-[100px]">
              <Icons.fileText
                size={32}
                weight="bold"
                className="text-primary/50 mb-1"
              />
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                {note.title}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">
                {note.contentType?.split("/")[1] || "File"}
              </span>
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed text-muted-foreground/60 break-all line-clamp-5 font-medium">
              {note.category === "URL" ? (
                <a
                  href={unlockedContent || note.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ring hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {unlockedContent || note.content}
                </a>
              ) : (
                unlockedContent || note.content
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 mt-3 border-t border-border/20 pl-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium font-mono text-muted-foreground">
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </span>
          {note.useCount > 0 && (
            <span className="text-[9px] font-medium font-mono text-muted-foreground/80">
              · {note.useCount}×
            </span>
          )}
        </div>

        <div className="flex gap-1 items-center">
          {(note.category === "IMAGE" || note.category === "DOCUMENT") && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={note.isProtected && unlockedContent === null}
              className="p-1.5 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
              title="Download file"
            >
              <Icons.download size={12} weight="bold" />
            </button>
          )}
          {note.category !== "IMAGE" && note.category !== "DOCUMENT" && (
            <button
              type="button"
              onClick={handleCopy}
              disabled={note.isProtected && unlockedContent === null}
              className={cn(
                "p-1.5 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                copied
                  ? "text-green-500"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40",
              )}
              title="Copy to clipboard"
            >
              {copied ? (
                <Icons.check size={12} weight="bold" />
              ) : (
                <Icons.copy size={12} weight="bold" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
