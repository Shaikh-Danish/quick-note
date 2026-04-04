"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Note } from "@/features/notes/client";

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
        "group relative flex flex-col justify-between p-4 transition-all duration-150 min-h-[140px]",
        "bg-card border-l-[3px] border-primary/10 hover:border-primary ring-1 ring-foreground/10 ring-inset",
        "rounded-none shadow-none hover:bg-foreground/[0.01]"
      )}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {note.tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="rounded-none px-1 py-0 text-[8px] uppercase tracking-tighter font-black border-foreground/5 bg-transparent text-muted-foreground/40"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onAction?.(note.id)}
            className="p-0.5 text-muted-foreground/20 hover:text-foreground transition-colors"
          >
            <Icons.dotsThree size={18} weight="bold" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-black uppercase tracking-tight text-foreground/90 leading-tight">
            {note.title}
          </h3>
          <p className="text-[12px] leading-normal text-muted-foreground/70 break-all line-clamp-6 font-medium tracking-tight">
            {note.content}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 mt-4 border-t border-foreground/5">
        <div className="flex items-baseline gap-2">
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20">
            Updated
          </span>
          <span className="text-[9px] font-bold text-muted-foreground/30 font-mono italic">
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "p-1 transition-all outline-none",
            copied 
              ? "text-green-500" 
              : "text-muted-foreground/20 hover:text-foreground"
          )}
        >
          {copied ? <Icons.check size={14} weight="bold" /> : <Icons.copy size={14} weight="bold" />}
        </button>
      </div>
    </div>
  );
}
