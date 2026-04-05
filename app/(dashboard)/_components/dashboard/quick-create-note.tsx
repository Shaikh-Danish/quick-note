"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNote } from "@/features/notes/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { type NoteSchema, noteSchema } from "@/lib/schemas/notes";

interface QuickCreateNoteProps {
  onSuccess?: () => void;
}

export function QuickCreateNote({ onSuccess }: QuickCreateNoteProps) {
  const [open, setOpen] = useState(false);
  const createNote = useCreateNote();

  const form = useZodForm<NoteSchema>(noteSchema, {
    defaultValues: { title: "", content: "", tags: [] },
    mode: "onChange",
  });

  const { register, handleSubmit, reset, formState: { isValid } } = form;

  const onSubmit = (data: NoteSchema) => {
    createNote.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="font-bold tracking-wide text-xs uppercase h-9 px-5 shadow-none border border-primary/20 hover:border-primary transition-colors">
            <Icons.plus className="mr-1.5" size={14} weight="bold" />
            Add Note
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border border-border shadow-2xl bg-card">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-black tracking-tight uppercase">
              New Note
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-2 space-y-4">
            <div className="space-y-1">
              <Input
                autoFocus
                placeholder="Note Title"
                {...register("title")}
                className="border-none shadow-none text-lg font-bold px-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
              />
            </div>

            <div className="h-px bg-border/40" />

            <div className="space-y-1">
              <Textarea
                placeholder="Write your note here..."
                {...register("content")}
                className="border-none shadow-none resize-none min-h-[200px] px-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground/30 bg-transparent leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-muted/30 flex items-center justify-between border-t border-border/30">
            <span className="text-[10px] text-muted-foreground/40 font-mono">
              ⌘ + Enter to save
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="font-semibold text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createNote.isPending || !isValid}
                className="px-6 font-bold text-xs uppercase tracking-wide h-8"
              >
                {createNote.isPending ? (
                  <Icons.loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : null}
                {createNote.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
