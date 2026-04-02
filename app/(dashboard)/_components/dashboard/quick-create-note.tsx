"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNote } from "@/features/notes/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { type NoteSchema, noteSchema } from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";

interface QuickCreateNoteProps {
  onSuccess?: () => void;
}

export function QuickCreateNote({ onSuccess }: QuickCreateNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const createNote = useCreateNote();
  const containerRef = useRef<HTMLDivElement>(null);

  const form = useZodForm<NoteSchema>(noteSchema, {
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const { register, handleSubmit, reset, watch } = form;
  const currentTitle = watch("title");
  const currentContent = watch("content");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!currentTitle && !currentContent) {
          setIsExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentTitle, currentContent]);

  const onSubmit = (data: NoteSchema) => {
    createNote.mutate(data, {
      onSuccess: () => {
        reset();
        setIsExpanded(false);
        onSuccess?.();
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-2xl mx-auto mb-12 transition-all duration-300 ease-in-out",
        isExpanded
          ? "scale-100 shadow-2xl"
          : "scale-95 opacity-80 hover:opacity-100",
      )}
    >
      <div
        className={cn(
          "bg-card border-2 border-border overflow-hidden transition-all duration-300",
          isExpanded ? "rounded-none p-4" : "rounded-none p-2",
        )}
      >
        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center gap-4 px-4 py-2 cursor-text group border-none bg-transparent text-left focus:outline-none focus:ring-0"
          >
            <Icons.notebook
              className="text-muted-foreground group-hover:text-primary transition-colors"
              size={20}
            />
            <span className="text-muted-foreground font-medium">
              Take a note...
            </span>
            <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Icons.checkSquare size={18} className="text-muted-foreground" />
              <Icons.image size={18} className="text-muted-foreground" />
            </div>
          </button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              autoFocus
              placeholder="Title"
              {...register("title")}
              className="border-none shadow-none text-xl font-bold px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            <Textarea
              placeholder="Take a note..."
              {...register("content")}
              className="border-none shadow-none resize-none min-h-[120px] px-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icons.bell size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icons.userPlus size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icons.palette size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icons.image size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icons.archive size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icons.dotsThreeVertical size={18} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsExpanded(false);
                    reset();
                  }}
                  className="font-bold border-none"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createNote.isPending || (!currentTitle && !currentContent)
                  }
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 border-none"
                >
                  {createNote.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
