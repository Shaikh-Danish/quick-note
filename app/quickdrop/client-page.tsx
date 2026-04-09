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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="w-full max-w-2xl mx-auto mt-12 bg-card border border-border shadow-sm rounded-none overflow-hidden">
      <div className="p-8 pb-0 text-center">
        <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">
          QuickDrop
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Share text across devices securely via a 6-digit code.
        </p>
      </div>

      <Tabs defaultValue="drop" className="w-full p-8 pt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted rounded-none">
          <TabsTrigger
            value="drop"
            className="rounded-none font-bold uppercase tracking-widest text-xs"
            onClick={() => setCreatedCode(null)}
          >
            Drop Data
          </TabsTrigger>
          <TabsTrigger
            value="receive"
            className="rounded-none font-bold uppercase tracking-widest text-xs"
            onClick={() => setReceivedText(null)}
          >
            Receive Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drop">
          {createdCode ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-6">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center border border-border">
                <Icons.check className="w-8 h-8 text-primary" weight="bold" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase">
                Ready!
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-[280px] text-center">
                Use this code on another device. It will expire after one read.
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(createdCode)}
                className="text-5xl font-mono font-black tracking-widest text-foreground px-8 py-6 bg-muted/50 border border-border cursor-pointer hover:bg-muted transition-colors flex items-center gap-4 group"
              >
                {createdCode}
                <Icons.copy
                  size={20}
                  className="text-muted-foreground opacity-50 group-hover:opacity-100"
                />
              </button>
              <Button
                variant="outline"
                onClick={() => setCreatedCode(null)}
                className="mt-4 rounded-none border border-border"
              >
                Create Another Drop
              </Button>
            </div>
          ) : (
            <form
              onSubmit={createForm.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <Field data-invalid={!!createForm.formState.errors.content}>
                <FieldContent>
                  <Textarea
                    placeholder="Type or paste the text you want to share..."
                    className={`min-h-[200px] resize-none text-base p-4 rounded-none border ${createForm.formState.errors.content ? "border-destructive" : "border-border/50"} focus-visible:ring-1 focus-visible:ring-primary`}
                    {...createForm.register("content")}
                  />
                </FieldContent>
                <FieldError
                  errors={
                    createForm.formState.errors.content
                      ? [createForm.formState.errors.content]
                      : undefined
                  }
                />
              </Field>
              <Button
                type="submit"
                className="w-full font-black h-12 uppercase tracking-widest rounded-none"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Icons.loader2 className="animate-spin" />
                ) : (
                  "Generate Code"
                )}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-bold">
                Burns after reading
              </p>
            </form>
          )}
        </TabsContent>

        <TabsContent value="receive">
          {receivedText ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground tracking-tight uppercase">
                  Decoded Data
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 border border-border/50">
                  Burned 🔥
                </span>
              </div>
              <div className="bg-muted/30 border border-border/50 p-4 font-mono text-sm whitespace-pre-wrap min-h-[160px] relative group/card">
                {receivedText}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-50 group-hover/card:opacity-100 transition-opacity rounded-none"
                  onClick={() => copyToClipboard(receivedText)}
                >
                  <Icons.copy size={14} />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setReceivedText(null)}
                className="w-full mt-4 rounded-none uppercase font-bold text-xs tracking-widest border border-border"
              >
                Receive Another
              </Button>
            </div>
          ) : (
            <form
              onSubmit={receiveForm.handleSubmit(handleFetch)}
              className="flex flex-col items-center justify-center p-8 space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black tracking-tight uppercase">
                  Retrieve Data
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Enter the 6-character access code
                </p>
              </div>

              <Field data-invalid={!!receiveForm.formState.errors.accessCode}>
                <FieldContent>
                  <Controller
                    control={receiveForm.control}
                    name="accessCode"
                    render={({ field }) => (
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val.toUpperCase());
                        }}
                        onComplete={() =>
                          receiveForm.handleSubmit(handleFetch)()
                        }
                      >
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={`w-12 h-14 text-xl font-bold uppercase rounded-none border ${receiveForm.formState.errors.accessCode ? "border-destructive text-destructive" : "border-border"}`}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </FieldContent>
                <FieldError
                  errors={
                    receiveForm.formState.errors.accessCode
                      ? [receiveForm.formState.errors.accessCode]
                      : undefined
                  }
                />
              </Field>

              <Button
                type="submit"
                className="w-full font-black h-12 mt-4 uppercase tracking-widest rounded-none"
                disabled={fetchMutation.isPending}
              >
                {fetchMutation.isPending ? (
                  <Icons.loader2 className="animate-spin" />
                ) : (
                  "Access Data"
                )}
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
