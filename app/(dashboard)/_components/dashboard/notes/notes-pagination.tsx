"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface NotesPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NotesPagination({ page, totalPages, onPageChange }: NotesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/20">
      <span className="text-[10px] font-mono text-muted-foreground/40">
        Page {page} of {totalPages}
      </span>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className={cn(
            "border-border/40 transition-all cursor-pointer rounded-none",
            page <= 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-muted/40 hover:border-border",
          )}
        >
          <Icons.arrowLeft size={12} weight="bold" />
        </Button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return (
            <Button
              key={pageNum}
              type="button"
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "min-w-[28px] h-7 px-2 text-[10px] font-bold border border-border/40 transition-all cursor-pointer rounded-none",
                pageNum === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground/50 hover:bg-muted/40 hover:border-border",
              )}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className={cn(
            "border-border/40 transition-all cursor-pointer rounded-none",
            page >= totalPages
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-muted/40 hover:border-border",
          )}
        >
          <Icons.arrowRight size={12} weight="bold" />
        </Button>
      </div>
    </div>
  );
}
