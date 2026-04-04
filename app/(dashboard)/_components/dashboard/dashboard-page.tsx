"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
                Your Notes
              </h2>
              <p className="text-muted-foreground">
                Quick notes, saved for instant access.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50 self-start sm:self-center">
              <Button
                variant={sortBy === "latest" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortBy("latest")}
                className={cn(
                  "rounded-md h-8 text-[11px] font-black uppercase tracking-widest",
                  sortBy === "latest" ? "shadow-sm" : "text-muted-foreground/50",
                )}
              >
                Latest
              </Button>
              <Button
                variant={sortBy === "most_copied" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortBy("most_copied")}
                className={cn(
                  "rounded-md h-8 text-[11px] font-black uppercase tracking-widest",
                  sortBy === "most_copied"
                    ? "shadow-sm"
                    : "text-muted-foreground/50",
                )}
              >
                Most Used
              </Button>
            </div>
          </div>

          <QuickCreateNote />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border bg-background shadow-sm animate-pulse-slow">
              <p className="text-muted-foreground font-medium">
                Loading Notes...
              </p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border bg-background shadow-sm animate-pulse-slow">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <Icons.notebook size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No notes found
              </h3>
              <p className="text-muted-foreground max-w-xs text-center mb-8">
                Save your first note for quick access whenever you need it.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
