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
    <div className="flex justify-end mb-5">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button className="font-semibold shadow-sm px-5 h-11 rounded-lg">
              <Icons.plus className="mr-2" size={18} />
              Add Note
            </Button>
          }
        />
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl font-black tracking-tight">
                New Note
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 pt-2 space-y-4">
              <div className="space-y-1">
                <Input
                  autoFocus
                  placeholder="Note Title"
                  {...register("title")}
                  className="border-none shadow-none text-xl font-bold px-0 focus-visible:ring-0 placeholder:text-muted-foreground/20 bg-transparent"
                />
              </div>

              <div className="space-y-1">
                <Textarea
                  placeholder="Write your note here..."
                  {...register("content")}
                  className="border-none shadow-none resize-none min-h-[200px] px-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground/20 bg-transparent leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-muted/50 flex items-center justify-end border-t border-border/10">

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createNote.isPending || !isValid}
                  className="px-8 font-bold shadow-md shadow-primary/20"
                >
                  {createNote.isPending ? (
                    <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {createNote.isPending ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
