"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Icons } from "@/components/ui/icons";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
        toast.success("Drop created successfully!");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create Drop");
      },
    });
  };

  const handleFetch = (data: z.infer<typeof fetchQuickDropSchema>) => {
    fetchMutation.mutate(data.accessCode.toUpperCase(), {
      onSuccess: (res) => {
        setReceivedText(res.content);
        receiveForm.reset();
        toast.success("Drop received!");
      },
      onError: (err) => {
        toast.error(err.message || "Could not retrieve Drop");
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 px-4 md:px-6 mb-32 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background blur-3xl opacity-50 pointer-events-none" />

      <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-6 shadow-sm ring-1 ring-primary/20">
          <Icons.lock weight="duotone" className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">QuickDrop</h1>
        <p className="text-muted-foreground/80 max-w-sm mx-auto text-[15px] font-medium leading-relaxed">
          End-to-end encrypted text beaming. Temporary, instant, and self-destructing.
        </p>
      </div>

      <div className="bg-card dark:bg-zinc-900/40 backdrop-blur-3xl border border-border/40 shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-border/30 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/40">

          {/* === UPLOAD COLUMN === */}
          <div className="p-8 sm:p-12 transition-colors">
            <h2 className="text-xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <Icons.arrowSquareOut className="w-5 h-5 text-primary" weight="duotone" />
              Create Drop
            </h2>
            <p className="text-muted-foreground text-sm mb-8 font-medium">Encrypt a payload and generate an access key.</p>

            {createdCode ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 fade-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mb-5 ring-1 ring-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                  <Icons.check weight="bold" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">Drop Secured!</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-8 max-w-[250px] leading-relaxed">
                  Ready to be accessed. The vault will burn automatically after one read.
                </p>

                <Button
                  onClick={() => copyToClipboard(createdCode)}
                  className="w-full bg-background border border-border/60 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-md relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-5xl font-mono font-bold tracking-widest text-foreground relative z-10">{createdCode}</span>
                  <div className="absolute top-4 right-4 text-muted-foreground group-hover:text-primary transition-colors bg-background p-2 rounded-full shadow-xs border border-border/50">
                    <Icons.copy size={14} />
                  </div>
                </Button>

                <Button variant="ghost" onClick={() => setCreatedCode(null)} className="mt-8 font-semibold rounded-xl text-muted-foreground hover:text-foreground">
                  Create another drop
                </Button>
              </div>
            ) : (
              <form onSubmit={createForm.handleSubmit(handleCreate)} className="flex flex-col space-y-8 animate-in fade-in duration-500">
                <Field data-invalid={!!createForm.formState.errors.content}>
                  <FieldContent>
                    <Textarea
                      placeholder="Enter text payload to encrypt..."
                      className="min-h-[200px] resize-none p-5 bg-background/50 border-border/50 text-[15px] focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-primary/10 shadow-inner rounded-2xl leading-relaxed"
                      {...createForm.register("content")}
                    />
                  </FieldContent>
                  <FieldError errors={createForm.formState.errors.content ? [createForm.formState.errors.content] : undefined} className="mt-2 ml-1" />
                </Field>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[12px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                    <Icons.warning size={14} className="text-orange-500" weight="fill" />
                    Burns after reading
                  </p>
                  <Button type="submit" size="lg" className="rounded-xl shadow-md font-bold px-8 active:scale-[0.98] transition-transform w-full sm:w-auto" disabled={createMutation.isPending}>
                    {createMutation.isPending ? <Icons.loader2 className="animate-spin mr-2" /> : <Icons.lock className="mr-2" weight="bold" />}
                    Encrypt Data
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* === DOWNLOAD COLUMN === */}
          <div className="p-8 sm:p-12 bg-muted/10 transition-colors">
            <h2 className="text-xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <Icons.magnifyingGlass className="w-5 h-5 text-primary" weight="duotone" />
              Access Drop
            </h2>
            <p className="text-muted-foreground text-sm mb-8 font-medium">Use an access key to unlock a secure vault.</p>

            {receivedText ? (
              <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500 min-h-[300px]">
                <div className="flex items-center justify-between pointer-events-none mb-4">
                  <span className="font-bold text-sm tracking-tight">Decrypted Output</span>
                  <span className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                    <Icons.trash weight="fill" size={10} />
                    Burned
                  </span>
                </div>
                <div className="flex-1 bg-background rounded-2xl p-6 border border-border/60 font-mono text-sm shadow-inner relative group whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[320px] custom-scrollbar focus:outline-none">
                  {receivedText}
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl shadow-sm bg-background border-border"
                    onClick={() => copyToClipboard(receivedText)}
                  >
                    <Icons.copy size={14} />
                  </Button>
                </div>
                <div className="flex justify-end mt-8">
                  <Button variant="outline" onClick={() => setReceivedText(null)} className="rounded-xl font-bold w-full border-border/50 hover:bg-muted/50">
                    Extract Another Vault
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={receiveForm.handleSubmit(handleFetch)} className="flex flex-col min-h-[300px] animate-in fade-in duration-500">
                <div className="flex-1 flex flex-col items-center justify-center py-6 w-full">
                  <Field data-invalid={!!receiveForm.formState.errors.accessCode} className="w-full flex flex-col items-center max-w-[340px]">
                    <FieldContent>
                      <Controller
                        control={receiveForm.control}
                        name="accessCode"
                        render={({ field }) => (
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={(val) => field.onChange(val.toUpperCase())}
                            onComplete={() => receiveForm.handleSubmit(handleFetch)()}
                          >
                            <InputOTPGroup className="gap-2 sm:gap-3">
                              {[0, 1, 2, 3, 4, 5].map((index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className={`w-11 h-16 sm:w-14 sm:h-[72px] text-2xl sm:text-3xl font-black font-mono rounded-2xl bg-background border border-border/50 shadow-inner focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all uppercase ${receiveForm.formState.errors.accessCode ? 'border-destructive/50 ring-destructive/20 bg-destructive/5 text-destructive focus-within:border-destructive/50 focus-within:ring-destructive/20' : ''}`}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        )}
                      />
                    </FieldContent>
                    <FieldError
                      className="mt-6 text-center text-xs font-bold uppercase tracking-widest text-destructive"
                      errors={receiveForm.formState.errors.accessCode ? [receiveForm.formState.errors.accessCode] : undefined}
                    />
                  </Field>
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl shadow-md font-bold mt-auto active:scale-[0.98] transition-transform" disabled={fetchMutation.isPending}>
                  {fetchMutation.isPending ? <Icons.loader2 className="animate-spin mr-2" /> : <Icons.lockOpen className="mr-2" weight="bold" />}
                  Unlock Data
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
