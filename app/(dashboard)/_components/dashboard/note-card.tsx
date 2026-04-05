"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import type { Note } from "@/features/notes/client";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onCopy?: (note: Note) => void;
  onAction?: (id: string) => void;
}

export function NoteCard({ note, onCopy, onAction }: NoteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="flex flex-wrap gap-1">
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
          <p className="text-[11px] leading-relaxed text-muted-foreground/60 break-all line-clamp-5 font-medium">
            {note.content}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 mt-3 border-t border-border/20 pl-1">
        <span className="text-[9px] font-mono text-muted-foreground/30">
          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "p-1.5 transition-all duration-150 cursor-pointer",
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
  );
}
