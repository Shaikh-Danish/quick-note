"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

import type { Note } from "@/features/notes/client";
import { useGeneratePrintLink } from "@/features/print/client";
import type { NoteType } from "@/lib/schemas/notes";
import { TYPE_LABELS } from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";
import { DeleteNoteDialog } from "./delete-note-dialog";
import { PrintLinkDialog } from "./print-link-dialog";
import { ProtectedNoteForm } from "./protected-note-form";

const TYPE_ICONS: Record<NoteType, keyof typeof Icons> = {
  TEXT: "textT",
  URL: "link",
  IMAGE: "image",
  DOCUMENT: "file",
  MARKDOWN: "article",
};

/**
 * Returns the file URL for a file-based note.
 */
function getFileUrl(noteId: string): string {
  return `/api/notes/${noteId}/file`;
}

/**
 * Formats file size in human-readable form.
 */
function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const generatePrintMutation = useGeneratePrintLink();

  const isFileBased = note.type === "IMAGE" || note.type === "DOCUMENT";
  const hasFileKey = !!note.fileKey;

  const handleCopy = () => {
    onCopy?.({ ...note, content: unlockedContent || note.content });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasFileKey) {
      // Download from R2 via API
      const a = document.createElement("a");
      a.href = getFileUrl(note.id);
      const ext =
        note.contentType?.split("/")[1] ||
        (note.type === "IMAGE" ? "png" : "pdf");
      a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Legacy: base64 data URL download
      const contentToDownload = unlockedContent || note.content;
      const a = document.createElement("a");
      a.href = contentToDownload;
      const ext =
        note.contentType?.split("/")[1] ||
        (note.type === "IMAGE" ? "png" : "pdf");
      a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    onDownload?.(note);
  };

  const handleShareForPrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    generatePrintMutation.mutate(note.id, {
      onSuccess: () => {
        setIsPrintDialogOpen(true);
      },
    });
  };

  const TypeIcon = Icons[TYPE_ICONS[note.type]];

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
            {/* Type badge */}
            <Badge
              variant="outline"
              className="rounded-none px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black border-border/30 bg-muted/30 text-muted-foreground/50 gap-1"
            >
              <TypeIcon size={10} weight="bold" />
              {TYPE_LABELS[note.type]}
            </Badge>
            {/* Category badge */}
            {note.category && (
              <Badge
                variant="outline"
                className="rounded-none px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black border-primary/20 bg-primary/5 text-primary/60 gap-1"
              >
                <Icons.tag size={10} weight="bold" />
                {note.category}
              </Badge>
            )}
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
          <h3 className="text-xs font-black tracking-wide text-foreground/90 leading-tight">
            {note.title}
          </h3>
          {note.isProtected && unlockedContent === null ? (
            <ProtectedNoteForm note={note} onSuccess={setUnlockedContent} />
          ) : note.type === "IMAGE" ? (
            <div className="mt-2 flex justify-center bg-muted/20 border border-border/50 max-h-[200px] overflow-hidden rounded-sm">
              {hasFileKey ? (
                // R2 file — use API route as image source
                <Image
                  src={getFileUrl(note.id)}
                  alt={note.title}
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                  unoptimized // Skip Next.js image optimization for API routes
                />
              ) : (
                // Legacy: base64 data URL
                <Image
                  src={unlockedContent || note.content}
                  alt={note.title}
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          ) : note.type === "DOCUMENT" ? (
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
                {note.fileSize ? ` · ${formatFileSize(note.fileSize)}` : ""}
              </span>
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed text-muted-foreground/60 break-all line-clamp-5 font-medium">
              {note.type === "URL" ? (
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleShareForPrint}
            disabled={
              generatePrintMutation.isPending ||
              (note.isProtected && unlockedContent === null)
            }
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
            title="Generate secure one-time print link"
          >
            {generatePrintMutation.isPending ? (
              <Icons.loader2 size={12} className="animate-spin" />
            ) : (
              <Icons.printer size={12} weight="bold" />
            )}
          </Button>

          {isFileBased && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => window.open(getFileUrl(note.id), "_blank")}
                disabled={
                  note.isProtected && unlockedContent === null && !hasFileKey
                }
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                title="Open in new tab"
              >
                <Icons.arrowSquareOut size={12} weight="bold" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={
                  note.isProtected && unlockedContent === null && !hasFileKey
                }
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                title="Download file"
              >
                <Icons.download size={12} weight="bold" />
              </Button>
            </>
          )}
          {!isFileBased && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              disabled={note.isProtected && unlockedContent === null}
              className={cn(
                "h-8 w-8 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                copied
                  ? "text-green-500 hover:text-green-600 hover:bg-green-50/50"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40",
              )}
              title="Copy to clipboard"
            >
              {copied ? (
                <Icons.check size={12} weight="bold" />
              ) : (
                <Icons.copy size={12} weight="bold" />
              )}
            </Button>
          )}
        </div>
      </div>

      <PrintLinkDialog
        url={generatePrintMutation.data?.url || ""}
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
      />
    </div>
  );
}
