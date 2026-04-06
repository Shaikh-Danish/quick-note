"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import type { NoteCategory } from "@/lib/schemas/notes";
import { CATEGORY_LABELS, NOTE_CATEGORIES } from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<NoteCategory, keyof typeof Icons> = {
  TEXT: "textT",
  URL: "link",
  IMAGE: "image",
  DOCUMENT: "file",
  MARKDOWN: "article",
};

interface AdvancedFilterProps {
  category: NoteCategory | undefined;
  onCategoryChange: (category: NoteCategory | undefined) => void;
  sortBy: "latest" | "most_used";
  onSortChange: (sort: "latest" | "most_used") => void;
}

export function AdvancedFilter({
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
}: AdvancedFilterProps) {
  const activeFiltersCount = (category ? 1 : 0) + (sortBy !== "latest" ? 1 : 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 px-3 h-8 border border-border/40 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:border-border focus:outline-none focus:ring-1 focus:ring-ring",
          activeFiltersCount > 0 ? "text-foreground bg-muted/20" : "text-muted-foreground/60",
        )}
      >
        <Icons.funnel size={12} weight="bold" />
        <span className="hidden sm:inline">Filter & Sort</span>
        <span className="sm:hidden">Filter</span>
        {activeFiltersCount > 0 && (
          <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[9px]">
            {activeFiltersCount}
          </span>
        )}
        <Icons.caretDown size={10} weight="bold" className="text-muted-foreground/40 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-[180px] p-1">
        
        {/* Sort Group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1.5">
            Sort By
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(v) => onSortChange(v as "latest" | "most_used")}
        >
          <DropdownMenuRadioItem value="most_used" className="px-2 py-1.5 cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-widest">Top / Most Used</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="latest" className="px-2 py-1.5 cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-widest">Latest</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className="my-1" />

        {/* Category Group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1.5">
            <Icons.funnel size={12} />
            Category
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup
          value={category ?? "ALL"}
          onValueChange={(v) =>
            onCategoryChange(v === "ALL" ? undefined : (v as NoteCategory))
          }
        >
          <DropdownMenuRadioItem value="ALL" className="px-2 py-1.5 cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-widest">All Types</span>
          </DropdownMenuRadioItem>
          {NOTE_CATEGORIES.map((cat) => {
            const CatIcon = Icons[CATEGORY_ICONS[cat]];
            return (
              <DropdownMenuRadioItem key={cat} value={cat} className="px-2 py-1.5 cursor-pointer">
                <CatIcon size={12} weight="bold" className="mr-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {CATEGORY_LABELS[cat]}
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
