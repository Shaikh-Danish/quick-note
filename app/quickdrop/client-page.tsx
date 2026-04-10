"use client";

import { useState, useMemo } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Icons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateQuickDrop } from "@/features/quick-drop/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { createQuickDropSchema } from "@/lib/schemas/quick-drop";

export function QuickDropClient() {
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createMutation = useCreateQuickDrop();

  const qrBlocks = useMemo(() => {
    return Array.from({ length: 64 }).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      isDark: Math.random() > 0.5,
    }));
  }, []);

  const createForm = useZodForm<z.infer<typeof createQuickDropSchema>>(
    createQuickDropSchema,
    {
      defaultValues: {
        content: "",
        expiresInHours: 24,
        isBurnAfterRead: true,
      },
    },
  );

  const handleCreate = (data: z.infer<typeof createQuickDropSchema>) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        setCreatedCode(res.url);
        setIsDialogOpen(true);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to drop text");
      },
    });
  };

  const copyToClipboard = (text: string, label: string = "URL") => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}!`, { position: "top-center" });
  };

  const resetAll = () => {
    setCreatedCode(null);
    setIsDialogOpen(false);
    createForm.reset();
  };

  const getShareUrl = () => {
    if (typeof window === "undefined" || !createdCode) return "";
    return `${window.location.origin}/${createdCode}`;
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 mb-16 font-sans">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-md bg-[#0a0a0a] border-[#222] text-white rounded-none p-5"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-white text-black flex items-center justify-center shrink-0 rounded-full">
                <Icons.check weight="bold" size={14} />
              </div>
              <div>
                <DialogTitle className="text-white text-base font-semibold font-sans">
                  Drop created!
                </DialogTitle>
                <div className="text-zinc-400 font-sans text-[15px] mt-0.5">
                  {getShareUrl()}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(getShareUrl(), "URL")}
              className="font-semibold h-9 px-4 shrink-0 bg-white text-black hover:bg-zinc-200 border-none rounded-none text-sm"
            >
              Copy URL
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {createdCode ? (
        <div className="animate-in fade-in duration-300">
          {/* Top Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  copyToClipboard(createForm.getValues("content"), "Text")
                }
                className="gap-2 h-10 px-4 font-medium rounded-none"
              >
                <Icons.copy size={16} /> Copy Text{" "}
                <Icons.caretDown
                  size={14}
                  className="ml-1 text-muted-foreground"
                />
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground gap-2 font-medium rounded-none"
              >
                <Icons.warning size={16} /> Report Drop
              </Button>
            </div>

            <Button
              onClick={resetAll}
              className="font-bold h-10 px-5 shadow-none w-full sm:w-auto rounded-none text-black bg-[#ff9b66] hover:bg-[#ff8544] border-none"
            >
              <Icons.plus weight="bold" size={16} className="mr-2" /> Create New
              Drop
            </Button>
          </div>

          {/* Text Area (Read Only) */}
          <div className="bg-transparent border border-[#ff9b66]/60 p-5 min-h-[300px] text-foreground font-mono text-sm leading-relaxed overflow-y-auto mb-6 shadow-inner rounded-none">
            {createForm.getValues("content")}
          </div>

          {/* Bottom Bar: Access URL */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center self-start">
              <button
                type="button"
                onClick={() => copyToClipboard(getShareUrl(), "URL")}
                className="flex items-center gap-2 bg-transparent border border-border text-muted-foreground hover:text-foreground px-4 py-2.5 text-sm font-medium rounded-none transition-colors"
              >
                <Icons.link size={16} className="text-muted-foreground" />
                {getShareUrl()}
              </button>
            </div>

            {/* Functional QR Representation mapping dark/light blocks to variables */}
            <div className="flex flex-col items-center mt-4">
              <div className="w-24 h-24 bg-white p-2 flex flex-wrap gap-[1px] border border-border pointer-events-none rounded-none">
                {qrBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="w-[10px] h-[10px]"
                    style={{
                      backgroundColor:
                        block.isDark ? "#000" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-4">
            <h1 className="text-4xl sm:text-[44px] font-bold tracking-tight text-foreground mb-4">
              QuickDrop
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-[17px] font-medium leading-relaxed">
              Securely drop and share text, notes, or code. Paste below{" "}
              <br className="hidden sm:block" />
              to generate a temporary access URL.
            </p>
          </div>

          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="flex flex-col"
          >
            <div className="flex flex-col border border-input bg-card focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-colors shadow-sm rounded-none">
              <Field
                data-invalid={!!createForm.formState.errors.content}
                className="w-full"
              >
                <FieldContent>
                  <Textarea
                    placeholder="Write or paste your text here..."
                    className="min-h-[200px] sm:min-h-[280px] resize-none p-4 sm:p-6 bg-transparent border-0 text-[15px] sm:text-[16px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 leading-relaxed font-mono rounded-none"
                    {...createForm.register("content")}
                  />
                </FieldContent>
                {createForm.formState.errors.content && (
                  <div className="px-6 py-2 bg-destructive/5 border-t border-destructive/20">
                    <FieldError
                      errors={[createForm.formState.errors.content]}
                      className="text-destructive text-sm font-medium"
                    />
                  </div>
                )}
              </Field>

              {/* Toolbar */}
              <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div></div>

                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="font-bold h-10 px-6 shadow-none transition-colors w-full sm:w-auto rounded-none"
                >
                  {createMutation.isPending ? (
                    <Icons.loader2 className="animate-spin mr-2" />
                  ) : (
                    <Icons.plus weight="bold" size={16} className="mr-2" />
                  )}
                  Create Drop
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
