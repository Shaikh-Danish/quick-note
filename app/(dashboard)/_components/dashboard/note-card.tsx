"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { unlockNoteContent } from "@/features/notes/actions";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
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
  onAction?: (id: string) => void;
}

export function NoteCard({ note, onCopy, onAction }: NoteCardProps) {
  const [copied, setCopied] = useState(false);
  const [unlockedContent, setUnlockedContent] = useState<string | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");

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
    const ext = note.contentType?.split('/')[1] || (note.category === "IMAGE" ? "png" : "pdf");
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockPassword) return;
    setUnlocking(true);
    setUnlockError("");
    try {
      const res = await unlockNoteContent(note.content, unlockPassword);
      if (res.success && res.content) {
        setUnlockedContent(res.content);
      } else {
        setUnlockError(res.error || "Failed to unlock");
      }
    } catch {
      setUnlockError("Failed to unlock");
    } finally {
      setUnlocking(false);
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
          {note.isProtected && unlockedContent === null ? (
            <div className="mt-2 space-y-2 pb-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">
                <Icons.password size={12} weight="bold" />
                Protected Content
              </div>
              <form onSubmit={handleUnlock} className="flex gap-1.5">
                <input
                  type="password"
                  className="h-7 px-2 text-xs w-full bg-muted/30 border border-border/40 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                  placeholder="Password..."
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                />
                <button
                  disabled={unlocking || !unlockPassword}
                  type="submit"
                  className="h-7 px-3 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest disabled:opacity-50 transition-opacity"
                >
                  {unlocking ? "Wait" : "Unlock"}
                </button>
              </form>
              {unlockError && (
                <p className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                  {unlockError}
                </p>
              )}
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
          <span className="text-[9px] font-mono text-muted-foreground/70">
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </span>
          {note.copiedCount > 0 && (
            <span className="text-[8px] font-mono text-muted-foreground/60">
              · {note.copiedCount}×
            </span>
          )}
        </div>

        <div className="flex gap-1 items-center">
          {(note.category === "IMAGE" || note.category === "DOCUMENT") && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={note.isProtected && unlockedContent === null}
              className="p-1.5 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground/20 hover:text-foreground hover:bg-muted/40"
              title="Download file"
            >
              <Icons.download size={12} weight="bold" />
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            disabled={note.isProtected && unlockedContent === null}
            className={cn(
              "p-1.5 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              copied
                ? "text-green-500"
                : "text-muted-foreground/20 hover:text-foreground hover:bg-muted/40",
            )}
            title="Copy to clipboard"
          >
            {copied ? (
              <Icons.check size={12} weight="bold" />
            ) : (
              <Icons.copy size={12} weight="bold" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
