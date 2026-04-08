"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
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
import { useCategories, useCreateNote } from "@/features/notes/client";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  NOTE_TYPES,
  type NoteSchema,
  type NoteType,
  noteSchema,
  TYPE_CONTENT_TYPES,
  TYPE_LABELS,
} from "@/lib/schemas/notes";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<NoteType, keyof typeof Icons> = {
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
  const { data: categories = [] } = useCategories();
  const comboboxAnchor = useComboboxAnchor();

  const form = useZodForm<NoteSchema>(noteSchema, {
    defaultValues: {
      title: "",
      content: "",
      type: "TEXT",
      category: "",
      tags: [],
      isProtected: false,
      password: "",
    },
    mode: "onChange",
  });

  const [internalType, setInternalType] = useState<NoteType>("TEXT");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = form;

  const [isProtected, setIsProtected] = useState(false);

  const onSubmit = (data: NoteSchema) => {
    const contentType = data.contentType || TYPE_CONTENT_TYPES[internalType];

    let payload: NoteSchema | FormData = {
      ...data,
      type: internalType,
      category: data.category || "",
      contentType,
    };

    if (
      selectedFile &&
      (internalType === "IMAGE" || internalType === "DOCUMENT")
    ) {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("type", internalType);
      if (data.category) formData.append("category", data.category);
      if (contentType) formData.append("contentType", contentType);

      formData.append("file", selectedFile);

      if (data.isProtected) formData.append("isProtected", "true");
      if (data.password) formData.append("password", data.password);
      if (data.tags && data.tags.length > 0)
        formData.append("tags", JSON.stringify(data.tags));

      payload = formData as unknown as NoteSchema;
    }

    createNote.mutate(payload, {
      onSuccess: () => {
        reset();
        setSelectedFile(null);
        setIsProtected(false);
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  const contentPlaceholder: Record<NoteType, string> = {
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

          <div className="px-6 space-y-5">
            {/* Type selector - Industrial Grid */}
            <div className="grid grid-cols-5 border border-border/40 p-1 bg-muted/20">
              {NOTE_TYPES.map((type) => {
                const IconComponent = Icons[TYPE_ICONS[type]];
                const isActive = internalType === type;
                return (
                  <Button
                    key={type}
                    type="button"
                    variant={isActive ? "default" : "ghost"}
                    onClick={(e) => {
                      e.preventDefault();
                      setInternalType(type);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center h-auto py-3 gap-2 transition-all duration-150 border-none rounded-none",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground/40 hover:text-foreground hover:bg-muted/40",
                    )}
                  >
                    <IconComponent
                      size={16}
                      weight={isActive ? "fill" : "bold"}
                    />
                    <span className="text-[8px] font-black uppercase tracking-[0.15em]">
                      {TYPE_LABELS[type]}
                    </span>
                  </Button>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 flex flex-col space-y-1.5">
                  <label
                    htmlFor="title-input"
                    className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1"
                  >
                    Title
                  </label>
                  <Input
                    id="title-input"
                    autoFocus
                    placeholder="Enter note title..."
                    {...register("title")}
                    className="h-10 border-border/40 bg-transparent text-sm font-bold tracking-tight px-3 focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-muted-foreground/20 rounded-none font-mono"
                  />
                </div>
                <div className="w-1/3 space-y-1.5 flex flex-col">
                  <label
                    htmlFor="category-input"
                    className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1"
                  >
                    Category
                  </label>
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Combobox
                        value={field.value}
                        onValueChange={field.onChange}
                        onInputValueChange={field.onChange}
                        inputValue={field.value || ""}
                      >
                        <div ref={comboboxAnchor} className="w-full">
                          <ComboboxInput
                            placeholder="Optional..."
                            className="h-10 border-border/40 bg-transparent text-[10px] font-bold tracking-widest px-3 focus-visible:ring-1 focus-visible:ring-primary/30 border-dashed rounded-none font-mono"
                          />
                        </div>
                        <ComboboxContent anchor={comboboxAnchor}>
                          <ComboboxList className="p-1">
                            {categories.length > 0 ? (
                              categories.map((cat) => (
                                <ComboboxItem
                                  key={cat.id}
                                  value={cat.name}
                                  className="text-[10px] uppercase font-bold tracking-wider"
                                >
                                  {cat.name}
                                </ComboboxItem>
                              ))
                            ) : (
                              <div className="p-2 text-[9px] text-muted-foreground/40 uppercase font-bold text-center">
                                No existing categories
                              </div>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-4 space-y-4">
            <div className="space-y-1.5 flex flex-col">
              <label
                htmlFor="content-input"
                className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1 mb-1.5"
              >
                Content
              </label>
              <Textarea
                id="content-input"
                placeholder={contentPlaceholder[internalType]}
                {...register("content")}
                className="border border-border/40 min-h-[140px] p-3 focus-visible:ring-1 focus-visible:ring-primary/30 text-sm placeholder:text-muted-foreground/30 bg-transparent leading-relaxed rounded-none resize-none font-mono"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
              />
            </div>

            {(internalType === "IMAGE" || internalType === "DOCUMENT") && (
              <div className="p-4 border border-dashed border-border/40 bg-muted/10 flex flex-col gap-3">
                <input
                  type="file"
                  accept={
                    internalType === "IMAGE"
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
                    setValue("content", "file-upload", {
                      shouldValidate: true,
                    });
                  }}
                  className="block w-full text-xs text-muted-foreground/70 file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer focus:outline-none transition-colors"
                />
                <p className="text-[9px] text-muted-foreground/40 uppercase font-medium tracking-wider">
                  Selecting a file will upload it securely without frontend
                  base64 conversion.
                </p>
              </div>
            )}

            {(internalType === "IMAGE" || internalType === "DOCUMENT") && (
              <div className="flex flex-col gap-3 p-4 border border-border/40 bg-muted/5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="isProtected"
                      className="text-xs font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Password Protection
                    </label>
                    <p className="text-[10px] text-muted-foreground/60">
                      Require a password to view this file
                    </p>
                  </div>
                  <Switch
                    id="isProtected"
                    checked={isProtected}
                    onCheckedChange={(checked) => {
                      setIsProtected(checked);
                      setValue("isProtected", checked, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      if (!checked)
                        setValue("password", "", { shouldValidate: true });
                    }}
                  />
                </div>

                {isProtected && (
                  <div className="pt-2">
                    <Input
                      type="password"
                      placeholder="Enter password..."
                      {...register("password")}
                      className="h-8 text-xs bg-background font-mono"
                    />
                  </div>
                )}
              </div>
            )}
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
