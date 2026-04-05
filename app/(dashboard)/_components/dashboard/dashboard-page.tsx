"use client";

import { useState } from "react";

import { Icons } from "@/components/ui/icons";
import { useIncrementCopyCount, useNotes } from "@/features/notes/client";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "./dashboard-header";
import { NoteCard } from "./note-card";
import { QuickCreateNote } from "./quick-create-note";

interface User {
  name?: string | null;
  email: string;
  image?: string | null;
}

export default function DashboardPage({ user }: { user: User | null }) {
  const [sortBy, setSortBy] = useState<"latest" | "most_copied">("most_copied");
  const { data: notes = [], isLoading } = useNotes(sortBy);
  const incrementCopy = useIncrementCopyCount();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <DashboardHeader user={user} />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                Notes
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground/40">
                {!isLoading && `${notes.length} items`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border/50">
                <button
                  type="button"
                  onClick={() => setSortBy("latest")}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer",
                    sortBy === "latest"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  Latest
                </button>
                <div className="w-px h-4 bg-border/40" />
                <button
                  type="button"
                  onClick={() => setSortBy("most_copied")}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer",
                    sortBy === "most_copied"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  Most Used
                </button>
              </div>

              <QuickCreateNote />
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border/40">
              <div className="flex items-center gap-3">
                <Icons.loader2 size={16} className="animate-spin text-muted-foreground/40" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                  Loading
                </p>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border/40">
              <div className="w-14 h-14 bg-muted/40 flex items-center justify-center mb-5">
                <Icons.notebook size={28} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70 mb-2">
                No notes yet
              </h3>
              <p className="text-xs text-muted-foreground/50 max-w-xs text-center mb-6 leading-relaxed">
                Save your first note for quick access whenever you need it.
              </p>
              <QuickCreateNote />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onCopy={(n) => {
                    navigator.clipboard.writeText(n.content);
                    incrementCopy.mutate(n.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
