"use client";

import { Icons } from "@/components/ui/icons";
import type { NoteCategory } from "@/lib/schemas/notes";
import { AdvancedFilter } from "./advanced-filter";
import { QuickCreateNote } from "./quick-create-note";

interface NotesToolbarProps {
  total: number;
  isLoading: boolean;
  sortBy: "latest" | "most_used";
  onSortChange: (sort: "latest" | "most_used") => void;
  category: NoteCategory | undefined;
  onCategoryChange: (category: NoteCategory | undefined) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function NotesToolbar({
  total,
  isLoading,
  sortBy,
  onSortChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: NotesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">

      {/* Top Row: Title */}
      <div className="flex items-baseline gap-2">
        <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
          Notes
        </h2>
        <span className="text-[10px] font-mono text-muted-foreground/40">
          {!isLoading && `${total} items`}
        </span>
      </div>

      {/* Bottom Row: Search, Filter, Add Note */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

        {/* Left side: Search */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground/30">
            <Icons.magnifyingGlass size={12} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-7 pr-3 py-1.5 border border-border/40 text-[11px] font-medium bg-transparent placeholder-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all h-8"
            placeholder="Search notes..."
          />
        </div>

        {/* Right side: Filter & Sort, Add button */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <AdvancedFilter
            category={category}
            onCategoryChange={onCategoryChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
          />

          <div className="w-px h-5 bg-border/40 hidden sm:block" />

          <QuickCreateNote />
        </div>

      </div>

    </div>
  );
}
