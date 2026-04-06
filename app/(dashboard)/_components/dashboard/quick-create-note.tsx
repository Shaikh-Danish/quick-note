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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNote } from "@/features/notes/client";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  CATEGORY_CONTENT_TYPES,
  CATEGORY_LABELS,
  NOTE_CATEGORIES,
  type NoteCategory,
  type NoteSchema,
  noteSchema,
} from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<NoteCategory, keyof typeof Icons> = {
  TEXT: "textT",
  URL: "link",
  IMAGE: "image",
  DOCUMENT: "file",
  MARKDOWN: "article",
};

interface QuickCreateNoteProps {
  onSuccess?: () => void;
}

export function QuickCreateNote({ onSuccess }: QuickCreateNoteProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createNote = useCreateNote();

  const form = useZodForm<NoteSchema>(noteSchema, {
    defaultValues: { title: "", content: "", category: "TEXT", tags: [] },
    mode: "onChange",
  });

  const [internalCategory, setInternalCategory] = useState<NoteCategory>("TEXT");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid },
  } = form;

  const onSubmit = (data: NoteSchema) => {
    const contentType =
      data.contentType || CATEGORY_CONTENT_TYPES[internalCategory];

    let payload: NoteSchema | FormData = { ...data, category: internalCategory, contentType };

    if (selectedFile && (internalCategory === "IMAGE" || internalCategory === "DOCUMENT")) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", internalCategory);
      if (contentType) formData.append("contentType", contentType);
      formData.append("file", selectedFile);
      if (data.isProtected) formData.append("isProtected", "true");
      if (data.password) formData.append("password", data.password);
      if (data.tags && data.tags.length > 0) formData.append("tags", JSON.stringify(data.tags));
      payload = formData as unknown as NoteSchema;
    }

    createNote.mutate(
      payload,
      {
        onSuccess: () => {
          reset();
          setSelectedFile(null);
          setOpen(false);
          onSuccess?.();
        },
      },
    );
  };

  const contentPlaceholder: Record<NoteCategory, string> = {
    TEXT: "Write your note here...",
    URL: "https://example.com",
    IMAGE: "Paste image URL or base64 data...",
    DOCUMENT: "Paste document content or reference...",
    MARKDOWN: "# Heading\n\nWrite **markdown** content here...",
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
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border border-border shadow-2xl bg-card">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <DialogHeader className="p-6 pb-3">
            <DialogTitle className="text-xl font-black tracking-tight uppercase">
              New Note
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-3">
            {/* Category selector */}
            <div className="flex items-center gap-1 border border-border/40 p-0.5 w-fit">
              {NOTE_CATEGORIES.map((cat) => {
                const IconComponent = Icons[CATEGORY_ICONS[cat]];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setInternalCategory(cat);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer",
                      internalCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/40",
                    )}
                  >
                    <IconComponent size={12} weight="bold" />
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 pt-2 space-y-4">
            <div className="space-y-1">
              <Input
                autoFocus
                placeholder="Note Title"
                {...register("title")}
                className="border-none shadow-none text-lg font-bold px-2 focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent"
              />
            </div>

            <div className="h-px bg-border/40" />

            <div className="space-y-3">
              <Textarea
                placeholder={contentPlaceholder[internalCategory]}
                {...register("content")}
                className="border-none shadow-none resize-none min-h-[140px] p-2 focus-visible:ring-0 text-sm placeholder:text-muted-foreground/30 bg-transparent leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
              />

              {(internalCategory === "IMAGE" ||
                internalCategory === "DOCUMENT") && (
                  <div className="p-4 border border-dashed border-border/40 bg-muted/10 flex flex-col gap-3">
                    <input
                      type="file"
                      accept={
                        internalCategory === "IMAGE"
                          ? "image/*"
                          : ".pdf,.doc,.docx,.txt"
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setValue("contentType", file.type, {
                          shouldValidate: true,
                        });

                        const currentTitle = form.getValues("title");
                        if (!currentTitle || currentTitle.trim() === "") {
                          const baseName = file.name.replace(/\.[^/.]+$/, "");
                          setValue("title", baseName, { shouldValidate: true });
                        }

                        setSelectedFile(file);
                        setValue("content", "file-upload", { shouldValidate: true });
                      }}
                      className="block w-full text-xs text-muted-foreground/70 file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer focus:outline-none transition-colors"
                    />
                    <p className="text-[9px] text-muted-foreground/40 uppercase font-medium tracking-wider">
                      Selecting a file will upload it securely without frontend base64 conversion.
                    </p>
                  </div>
                )}

              {(internalCategory === "IMAGE" ||
                internalCategory === "DOCUMENT") && (
                  <div className="flex flex-col gap-3 p-4 border border-border/40 bg-muted/5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label htmlFor="isProtected" className="text-xs font-bold uppercase tracking-wide cursor-pointer">
                          Password Protection
                        </label>
                        <p className="text-[10px] text-muted-foreground/60">
                          Require a password to view this file
                        </p>
                      </div>
                      <Switch
                        id="isProtected"
                        checked={watch("isProtected")}
                        onCheckedChange={(val) => {
                          setValue("isProtected", val, { shouldValidate: true });
                          if (!val) setValue("password", "", { shouldValidate: true });
                        }}
                      />
                    </div>
                    {watch("isProtected") && (
                      <div className="pt-2">
                        <Input
                          type="password"
                          placeholder="Enter password..."
                          {...register("password")}
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                    )}
                  </div>
                )}
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
