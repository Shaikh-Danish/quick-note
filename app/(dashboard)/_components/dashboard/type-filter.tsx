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
import type { NoteType } from "@/lib/schemas/notes";
import { NOTE_TYPES, TYPE_LABELS } from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<NoteType, keyof typeof Icons> = {
  TEXT: "textT",
  URL: "link",
  IMAGE: "image",
  DOCUMENT: "file",
  MARKDOWN: "article",
};

interface TypeFilterProps {
  value: NoteType | undefined;
  onChange: (type: NoteType | undefined) => void;
}

export function TypeFilter({ value, onChange }: TypeFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 px-3 h-8 border border-border/40 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:border-border focus:outline-none focus:ring-1 focus:ring-ring",
          value ? "text-foreground" : "text-muted-foreground/60",
        )}
      >
        <Icons.funnel size={12} weight="bold" />
        {value ? TYPE_LABELS[value] : "All Types"}
        <Icons.caretDown
          size={10}
          weight="bold"
          className="text-muted-foreground/40"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="min-w-[160px] p-1"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
            Filter by type
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value ?? "ALL"}
          onValueChange={(v) =>
            onChange(v === "ALL" ? undefined : (v as NoteType))
          }
        >
          <DropdownMenuRadioItem
            value="ALL"
            className="px-2 py-1.5 cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">
              All
            </span>
          </DropdownMenuRadioItem>
          {NOTE_TYPES.map((type) => {
            const TypeIcon = Icons[TYPE_ICONS[type]];
            return (
              <DropdownMenuRadioItem
                key={type}
                value={type}
                className="px-2 py-1.5 cursor-pointer"
              >
                <TypeIcon size={12} weight="bold" className="mr-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {TYPE_LABELS[type]}
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
