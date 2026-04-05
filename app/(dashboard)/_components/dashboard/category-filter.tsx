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

interface CategoryFilterProps {
  value: NoteCategory | undefined;
  onChange: (category: NoteCategory | undefined) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 px-3 h-8 border border-border/40 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:border-border focus:outline-none focus:ring-1 focus:ring-ring",
          value ? "text-foreground" : "text-muted-foreground/60",
        )}
      >
        <Icons.funnel size={12} weight="bold" />
        {value ? CATEGORY_LABELS[value] : "All Types"}
        <Icons.caretDown size={10} weight="bold" className="text-muted-foreground/40" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className="min-w-[160px] p-1">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
            Filter by type
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value ?? "ALL"}
          onValueChange={(v) =>
            onChange(v === "ALL" ? undefined : (v as NoteCategory))
          }
        >
          <DropdownMenuRadioItem value="ALL" className="px-2 py-1.5 cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-widest">All</span>
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
