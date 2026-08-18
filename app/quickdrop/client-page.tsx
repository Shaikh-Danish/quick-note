"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Icons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

import { useCreateQuickDrop } from "@/features/quick-drop/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { createQuickDropFormSchema } from "@/lib/schemas/quick-drop";

export function QuickDropClient() {
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [createdPlaintext, setCreatedPlaintext] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createMutation = useCreateQuickDrop();

  const createForm = useZodForm<z.infer<typeof createQuickDropFormSchema>>(
    createQuickDropFormSchema,
    {
      defaultValues: {
        content: "",
        expiresInHours: 24,
        isBurnAfterRead: true,
      },
    },
  );

  const handleCreate = (data: z.infer<typeof createQuickDropFormSchema>) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        setCreatedCode(res.url);
        setCreatedKey(res.key);
        setCreatedPlaintext(res.plaintext);
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
    setCreatedKey(null);
    setCreatedPlaintext("");
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
          className="max-w-md bg-background border-border text-foreground rounded-none p-6 shadow-2xl"
          showCloseButton={false}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-white text-black flex items-center justify-center shrink-0 rounded-full">
                <Icons.check weight="bold" size={14} />
              </div>
              <DialogTitle className="text-foreground text-sm font-semibold font-sans">
                Drop created!
              </DialogTitle>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Share the URL and this 6-character key. The key never leaves your
              browser and is required to decrypt the drop.
            </p>
            <div className="flex items-center justify-between gap-3 border border-border px-3 py-2">
              <span className="font-mono text-lg tracking-[0.35em] font-bold">
                {createdKey}
              </span>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(createdKey || "", "key")}
                className="font-bold h-9 px-3 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 border-none rounded-none text-sm"
              >
                Copy key
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(getShareUrl(), "URL")}
              className="font-medium h-9 rounded-none text-sm"
            >
              Copy URL
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {createdCode ? (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(createdPlaintext, "Text")}
                className="gap-2 h-10 px-4 font-medium rounded-none"
              >
                <Icons.copy size={16} /> Copy Text{" "}
                <Icons.caretDown
                  size={14}
                  className="ml-1 text-muted-foreground"
                />
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

          <div className="bg-transparent border border-[#ff9b66]/60 p-4 sm:p-5 min-h-[200px] sm:min-h-[300px] text-foreground font-mono text-[13px] sm:text-sm leading-relaxed overflow-y-auto mb-6 shadow-inner rounded-none">
            {createdPlaintext}
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-start gap-3 w-full">
              <button
                type="button"
                onClick={() => copyToClipboard(getShareUrl(), "URL")}
                className="flex items-center gap-2 bg-transparent border border-border text-muted-foreground hover:text-foreground px-4 py-2.5 text-[12px] sm:text-sm font-medium rounded-none transition-colors w-full sm:w-auto overflow-hidden"
              >
                <Icons.link
                  size={16}
                  className="text-muted-foreground shrink-0"
                />
                <span className="truncate">{getShareUrl()}</span>
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <div className="border border-border px-4 py-2.5">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Decrypt key
                  </p>
                  <p className="font-mono text-base tracking-[0.35em] font-bold">
                    {createdKey}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(createdKey || "", "key")}
                  className="h-10 px-4 rounded-none"
                >
                  <Icons.copy size={16} className="mr-2" /> Copy key
                </Button>
              </div>
              <p className="text-muted-foreground text-xs max-w-lg">
                The key is not stored on the server. Anyone with the URL must
                enter it to decrypt. This drop is burned after a successful
                view.
              </p>
            </div>

            <div className="flex flex-col items-center mt-4">
              <div className="bg-white p-3 border border-border rounded-none shadow-sm dark:bg-white">
                <QRCodeSVG
                  value={getShareUrl()}
                  size={120}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
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
              Encrypt text in your browser, then share a URL and a 6-character
              key. The server never sees the key or the plaintext.
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

              <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  A 6-character key is generated in your browser.
                </p>

                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="font-bold h-10 px-6 shadow-none transition-colors w-full sm:w-auto rounded-none"
                >
                  {createMutation.isPending ? (
                    <Icons.loader2 className="animate-spin mr-2" />
                  ) : (
                    <Icons.lock weight="bold" size={16} className="mr-2" />
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
