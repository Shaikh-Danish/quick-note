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
import { cn } from "@/lib/utils";

interface SortFilterProps {
  sortBy: "latest" | "most_used";
  onSortChange: (sort: "latest" | "most_used") => void;
}

export function SortFilter({
  sortBy,
  onSortChange,
}: SortFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 px-3 h-8 border border-border/40 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:border-border focus:outline-none focus:ring-1 focus:ring-ring",
          sortBy !== "latest" ? "text-foreground bg-muted/20" : "text-muted-foreground/60",
        )}
      >
        <Icons.arrowsDownUp size={12} weight="bold" />
        <span className="hidden sm:inline">
          {sortBy === "latest" ? "Latest" : "Most Used"}
        </span>
        <Icons.caretDown size={10} weight="bold" className="text-muted-foreground/40 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-[160px] p-1">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1.5">
            Sort By
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(v) => onSortChange(v as "latest" | "most_used")}
        >
          <DropdownMenuRadioItem value="most_used" className="px-2 py-1.5 cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-widest">Most Used</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="latest" className="px-2 py-1.5 cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-widest">Latest</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
