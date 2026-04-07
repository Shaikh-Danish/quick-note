"use client";

import { Icons } from "@/components/ui/icons";
import { useDeleteNote, useIncrementUseCount, useNotes } from "@/features/notes/client";
import { useNotesFilter } from "@/hooks/use-notes-filter";
import { DashboardHeader } from "./dashboard-header";
import { NoteCard } from "./note-card";
import { NotesPagination } from "./notes-pagination";
import { NotesToolbar } from "./notes-toolbar";
import { QuickCreateNote } from "./quick-create-note";

interface User {
  name?: string | null;
  email: string;
  image?: string | null;
}

export default function DashboardPage({ user }: { user: User | null }) {
  const filter = useNotesFilter();
  const limit = 12;

  const { data, isLoading } = useNotes({
    sort: filter.sortBy,
    type: filter.type,
    category: filter.category,
    search: filter.debouncedSearch || undefined,
    page: filter.page,
    limit,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;
  const incrementUse = useIncrementUseCount();
  const deleteNote = useDeleteNote();

  const hasActiveFilters = !!filter.debouncedSearch || !!filter.type || !!filter.category;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <DashboardHeader user={user} />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <NotesToolbar
            total={total}
            isLoading={isLoading}
            sortBy={filter.sortBy}
            onSortChange={filter.setSortBy}
            type={filter.type}
            onTypeChange={filter.setType}
            category={filter.category}
            onCategoryChange={filter.setCategory}
            search={filter.search}
            onSearchChange={filter.setSearch}
          />

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
                {hasActiveFilters ? "No matches" : "No notes yet"}
              </h3>
              <p className="text-xs text-muted-foreground/50 max-w-xs text-center mb-6 leading-relaxed">
                {hasActiveFilters
                  ? "Try adjusting your search or filter."
                  : "Save your first note for quick access whenever you need it."}
              </p>
              {!hasActiveFilters && <QuickCreateNote />}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onCopy={(n) => {
                      navigator.clipboard.writeText(n.content);
                      incrementUse.mutate(n.id);
                    }}
                    onDelete={(n) => {
                      deleteNote.mutate(n.id);
                    }}
                  />
                ))}
              </div>

              <NotesPagination
                page={filter.page}
                totalPages={totalPages}
                onPageChange={filter.setPage}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
