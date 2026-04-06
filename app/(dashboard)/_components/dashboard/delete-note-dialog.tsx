"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import type { Note } from "@/features/notes/client";

interface DeleteNoteDialogProps {
  note: Note;
  onDelete?: (note: Note) => void;
}

export function DeleteNoteDialog({ note, onDelete }: DeleteNoteDialogProps) {
  return (
    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 group-hover:bg-background/80 backdrop-blur-sm p-1 rounded-sm">
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground/30 hover:text-destructive rounded-sm transition-all opacity-0 group-hover:opacity-100"
              title="Delete Note"
            >
              <Icons.trash size={14} weight="bold" />
            </Button>
          }
        />
        <AlertDialogContent className="sm:max-w-[540px] p-0 overflow-hidden border border-border shadow-2xl bg-card">
          <AlertDialogHeader className="px-6 pt-3 pb-0 text-left">
            <AlertDialogTitle className="text-xl font-black tracking-tight uppercase text-left">
              Delete Note
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="px-6 pb-3">
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed text-left">
              This action cannot be undone. This will permanently delete the note{" "}
              <span className="font-bold text-foreground">"{note.title}"</span>.
            </AlertDialogDescription>
          </div>

          <div className="px-6 py-2 bg-muted/30 flex items-center justify-end border-t border-border/30">
            <div className="flex items-center gap-2">
              <AlertDialogCancel
                variant="ghost"
                className="font-semibold text-xs h-8"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete?.(note)}
                className="px-6 font-bold text-xs uppercase tracking-wide h-8"
              >
                Delete
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
