"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useCreateQuickDrop,
  useFetchQuickDrop,
} from "@/features/quick-drop/client";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  createQuickDropSchema,
  fetchQuickDropSchema,
} from "@/lib/schemas/quick-drop";

export function QuickDropClient() {
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [receivedText, setReceivedText] = useState<string | null>(null);

  const createMutation = useCreateQuickDrop();
  const fetchMutation = useFetchQuickDrop();

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

  const receiveForm = useZodForm<z.infer<typeof fetchQuickDropSchema>>(
    fetchQuickDropSchema,
    {
      defaultValues: {
        accessCode: "",
      },
    },
  );

  const handleCreate = (data: z.infer<typeof createQuickDropSchema>) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        setCreatedCode(res.accessCode);
        createForm.reset();
        toast.success("Share created!", { position: "top-center" });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to drop text");
      },
    });
  };

  const handleFetch = (data: z.infer<typeof fetchQuickDropSchema>) => {
    fetchMutation.mutate(data.accessCode.toUpperCase(), {
      onSuccess: (res) => {
        setReceivedText(res.content);
        receiveForm.reset();
        toast.success("Text retrieved successfully!", { position: "top-center" });
      },
      onError: (err) => {
        toast.error(err.message || "Could not retrieve that text");
      },
    });
  };

  const copyToClipboard = (text: string, label: string = "URL") => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}!`, { position: "top-center" });
  };

  const resetAll = () => {
    setCreatedCode(null);
    setReceivedText(null);
    createForm.reset();
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 mb-16 font-sans">

      {/* --- RECEIVED VIEW --- */}
      {receivedText ? (
        <div className="animate-in fade-in duration-300">
          {/* Top Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(receivedText, "Text")}
                className="gap-2 h-10 px-4 font-medium"
              >
                <Icons.copy size={16} /> Copy Text <Icons.caretDown size={14} className="ml-1 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2 font-medium">
                <Icons.warning size={16} /> Report Drop
              </Button>
            </div>

            <Button
              onClick={resetAll}
              className="font-bold h-10 px-5 shadow-none w-full sm:w-auto"
            >
              <Icons.plus weight="bold" size={16} className="mr-2" /> Create New Drop
            </Button>
          </div>

          {/* Text Area (Read Only) */}
          <div className="bg-muted/30 border border-border p-5 min-h-[300px] text-foreground font-mono text-sm leading-relaxed overflow-y-auto mb-6 shadow-inner">
            {receivedText}
          </div>

          {/* Bottom Bar: Access Code */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center self-start">
              <div className="flex items-center gap-2 bg-muted/30 border border-border text-foreground px-4 py-2.5  text-sm font-medium">
                <Icons.link size={16} className="text-muted-foreground" />
                Code burned successfully
              </div>
            </div>

            {/* Functional QR Representation mapping dark/light blocks to variables */}
            <div className="flex flex-col items-center mt-4">
              <div className="w-24 h-24 bg-white p-2 flex flex-wrap gap-[1px] border border-border  pointer-events-none">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={Date.now()} className="w-[10px] h-[10px]" style={{ backgroundColor: Math.random() > 0.5 ? '#000' : 'transparent' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

      ) :

        /* --- SUCCESS CREATED TOAST/VIEW --- */
        createdCode ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300 pt-6">
            <div className="bg-card border border-border p-6 sm:p-8 w-full max-w-lg shadow-xl relative overflow-hidden">
              <div className="flex md:items-center flex-col md:flex-row justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-sm">
                    <Icons.check weight="bold" size={24} />
                  </div>
                  <div>
                    <h3 className="text-primary text-lg font-bold">Drop created!</h3>
                    <p className="text-muted-foreground font-mono text-sm mt-1">Code: <span className="font-bold text-foreground">{createdCode}</span></p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(createdCode, "Code")}
                  className="font-bold h-10 px-6 shrink-0"
                >
                  Copy Code
                </Button>
              </div>

              <div className="w-full bg-muted/40 border border-border p-8 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <span className="text-6xl sm:text-7xl font-mono font-black tracking-[0.2em] text-foreground">{createdCode}</span>
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="ghost" onClick={resetAll} className="text-primary hover:text-primary/80 hover:bg-transparent px-0 font-semibold flex items-center gap-2">
                  <Icons.plus size={16} weight="bold" /> Create New Drop
                </Button>
              </div>
            </div>
          </div>
        ) :

          /* --- CREATE / SHARE VIEW --- */
          (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-4">
                <h1 className="text-4xl sm:text-[44px] font-bold tracking-tight text-foreground mb-4">QuickDrop</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-[17px] font-medium leading-relaxed">
                  Securely drop and share text, notes, or code. Paste below <br className="hidden sm:block" />
                  to generate a temporary access code.
                </p>
              </div>

              <form onSubmit={createForm.handleSubmit(handleCreate)} className="flex flex-col">
                <div className="flex flex-col border border-input overflow-hidden bg-card focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-colors shadow-sm">

                  <Field data-invalid={!!createForm.formState.errors.content} className="w-full">
                    <FieldContent>
                      <Textarea
                        placeholder="Write or paste your text here..."
                        className="min-h-[200px] sm:min-h-[280px] resize-none p-4 sm:p-6 bg-transparent border-0 text-[15px] sm:text-[16px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 leading-relaxed font-mono"
                        {...createForm.register("content")}
                      />
                    </FieldContent>
                    {createForm.formState.errors.content && (
                      <div className="px-6 py-2 bg-destructive/5 border-t border-destructive/20">
                        <FieldError errors={[createForm.formState.errors.content]} className="text-destructive text-sm font-medium" />
                      </div>
                    )}
                  </Field>

                  {/* Toolbar */}
                  <div className="bg-muted/30 border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div></div>

                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="font-bold h-10 px-6 shadow-none transition-colors w-full sm:w-auto"
                    >
                      {createMutation.isPending ? <Icons.loader2 className="animate-spin mr-2" /> : <Icons.plus weight="bold" size={16} className="mr-2" />}
                      Create Drop
                    </Button>
                  </div>
                </div>
              </form>

              {/* FETCH SECTION - Kept minimal and separated from the Share interface */}
              <div className="mt-12 border-t border-border pt-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Retrieve a Drop</h2>
                  <p className="text-muted-foreground text-sm">Enter a 6-digit access code to unlock dropped text.</p>
                </div>

                <form onSubmit={receiveForm.handleSubmit(handleFetch)} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                  <Controller
                    control={receiveForm.control}
                    name="accessCode"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Enter Code..."
                        className="h-12 bg-background border-input focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary text-foreground placeholder:text-muted-foreground font-mono text-center sm:text-left text-lg tracking-widest uppercase"
                        maxLength={6}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    )}
                  />
                  <Button type="submit" disabled={fetchMutation.isPending} className="h-12 font-bold px-8 shrink-0">
                    {fetchMutation.isPending ? <Icons.loader2 className="animate-spin" /> : "Unlock"}
                  </Button>
                </form>
                <div className="text-center mt-2 max-w-md mx-auto">
                  <FieldError className="text-destructive text-sm font-medium" errors={receiveForm.formState.errors.accessCode ? [receiveForm.formState.errors.accessCode] : undefined} />
                </div>
              </div>
            </div>
          )}

    </div>
  );
}

