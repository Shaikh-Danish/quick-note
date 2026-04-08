"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { unlockNoteContent } from "@/features/notes/actions";
import type { Note } from "@/features/notes/client";

interface ProtectedNoteFormProps {
  note: Note;
  onSuccess: (content: string) => void;
}

export function ProtectedNoteForm({ note, onSuccess }: ProtectedNoteFormProps) {
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsPending(true);
    setError("");
    try {
      const res = await unlockNoteContent(note.content, password);
      if (res.success && res.content) {
        onSuccess(res.content);
      } else {
        setError(res.error || "Failed to unlock");
      }
    } catch {
      setError("Failed to unlock");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mt-3 relative flex flex-col items-center justify-center min-h-[140px] rounded-md overflow-hidden bg-muted/5 border border-border/20 p-4">
      <div className="absolute inset-0 bg-linear-to-br from-background/60 to-muted/20 backdrop-blur-sm z-0" />
      <div className="relative z-10 flex flex-col items-center w-full max-w-[200px] space-y-4">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
            <Icons.password
              size={16}
              weight="duotone"
              className="text-primary/70"
            />
          </div>
          <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">
            {note.category === "IMAGE"
              ? "Protected Image"
              : note.category === "DOCUMENT"
                ? "Protected Document"
                : "Protected Note"}
          </span>
        </div>

        <form
          onSubmit={handleUnlock}
          className="flex flex-col w-full gap-2 relative"
        >
          <div className="relative group">
            <Input
              type="password"
              className="h-8 px-3 text-xs w-full bg-background border border-border/50 rounded-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30 text-center tracking-widest shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            disabled={isPending || !password}
            type="submit"
            className="h-8 w-full text-[10px] font-black uppercase tracking-widest rounded-sm disabled:opacity-50 transition-all shadow-sm"
          >
            {isPending ? "Validating" : "Unlock"}
          </Button>
        </form>
        {error && (
          <p className="text-[9px] text-destructive/90 font-bold uppercase tracking-wider text-center bg-destructive/10 px-2 py-0.5 rounded-sm w-full">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
