"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { unlockNoteContent } from "@/features/notes/actions";
import type { Note } from "@/features/notes/client";
import type { NoteCategory } from "@/lib/schemas/notes";
import { CATEGORY_LABELS } from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";

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
  onAction?: (id: string) => void;
}

export function NoteCard({ note, onCopy, onDownload, onAction }: NoteCardProps) {
  const [copied, setCopied] = useState(false);
  const [unlockState, setUnlockState] = useState({
    content: null as string | null,
    password: "",
    isPending: false,
    error: "",
  });

  const handleCopy = () => {
    onCopy?.({ ...note, content: unlockState.content || note.content });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const contentToDownload = unlockState.content || note.content;
    const a = document.createElement("a");
    a.href = contentToDownload;
    const ext = note.contentType?.split('/')[1] || (note.category === "IMAGE" ? "png" : "pdf");
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onDownload?.(note);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockState.password) return;
    setUnlockState((s) => ({ ...s, isPending: true, error: "" }));
    try {
      const res = await unlockNoteContent(note.content, unlockState.password);
      if (res.success && res.content) {
        setUnlockState((s) => ({ ...s, content: res.content }));
      } else {
        setUnlockState((s) => ({
          ...s,
          error: res.error || "Failed to unlock",
        }));
      }
    } catch {
      setUnlockState((s) => ({ ...s, error: "Failed to unlock" }));
    } finally {
      setUnlockState((s) => ({ ...s, isPending: false }));
    }
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
          <button
            type="button"
            onClick={() => onAction?.(note.id)}
            className="p-0.5 text-muted-foreground/15 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <Icons.dotsThree size={16} weight="bold" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wide text-foreground/90 leading-tight">
            {note.title}
          </h3>
          {note.isProtected && unlockState.content === null ? (
            <div className="mt-2 space-y-2 pb-1 bg-muted/20 p-3 border border-border/50 flex flex-col items-center justify-center min-h-[100px] rounded-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                <Icons.password size={16} weight="bold" className="text-primary/50" />
                Protected {note.category === "IMAGE" ? "Image" : note.category === "DOCUMENT" ? "Document" : "Content"}
              </div>
              <form onSubmit={handleUnlock} className="flex gap-1.5">
                <input
                  type="password"
                  className="h-7 px-2 text-xs w-full bg-muted/30 border border-border/40 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                  placeholder="Password..."
                  value={unlockState.password}
                  onChange={(e) =>
                    setUnlockState((s) => ({ ...s, password: e.target.value }))
                  }
                />
                <button
                  disabled={unlockState.isPending || !unlockState.password}
                  type="submit"
                  className="h-7 px-3 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest disabled:opacity-50 transition-opacity"
                >
                  {unlockState.isPending ? "Wait" : "Unlock"}
                </button>
              </form>
              {unlockState.error && (
                <p className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                  {unlockState.error}
                </p>
              )}
            </div>
          ) : note.category === "IMAGE" ? (
            <div className="mt-2 flex justify-center bg-muted/20 border border-border/50 max-h-[200px] overflow-hidden rounded-sm">
              <img src={unlockState.content || note.content} alt={note.title} className="object-cover w-full h-full" />
            </div>
          ) : note.category === "DOCUMENT" ? (
            <div className="mt-2 flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/50 rounded-sm min-h-[100px]">
              <Icons.fileText size={32} weight="bold" className="text-primary/50 mb-1" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{note.title}</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">{note.contentType?.split('/')[1] || "File"}</span>
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed text-muted-foreground/60 break-all line-clamp-5 font-medium">
              {note.category === "URL" ? (
                <a
                  href={unlockState.content || note.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ring hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {unlockState.content || note.content}
                </a>
              ) : (
                unlockState.content || note.content
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
              disabled={note.isProtected && unlockState.content === null}
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
              disabled={note.isProtected && unlockState.content === null}
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
