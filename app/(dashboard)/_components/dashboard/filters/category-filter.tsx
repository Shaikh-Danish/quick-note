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
import { useCategories } from "@/features/notes/client";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  value: string | undefined;
  onChange: (category: string | undefined) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { data: categories = [] } = useCategories();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 px-3 h-8 border border-border/40 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:border-border focus:outline-none focus:ring-1 focus:ring-ring",
          value ? "text-foreground border-primary/40 bg-primary/5" : "text-muted-foreground/60",
        )}
      >
        <Icons.tag size={12} weight="bold" />
        {value || "All Categories"}
        <Icons.caretDown
          size={10}
          weight="bold"
          className="text-muted-foreground/40"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="min-w-[180px] p-1"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
            Filter by category
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value ?? "ALL"}
          onValueChange={(v) =>
            onChange(v === "ALL" ? undefined : v)
          }
        >
          <DropdownMenuRadioItem
            value="ALL"
            className="px-3 py-2 cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">
              All Categories
            </span>
          </DropdownMenuRadioItem>
          {categories.map((cat) => (
            <DropdownMenuRadioItem
              key={cat.id}
              value={cat.name}
              className="px-3 py-2 cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {cat.name}
              </span>
            </DropdownMenuRadioItem>
          ))}
          {categories.length === 0 && (
            <div className="px-2 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
              No categories found
            </div>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
