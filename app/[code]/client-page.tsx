"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useFetchQuickDrop } from "@/features/quick-drop/client";
import { DROP_KEY_LENGTH, normalizeDropKey } from "@/lib/drop-crypto";

export function QuickDropViewClient({ url }: { url: string }) {
  const [key, setKey] = useState("");
  const fetchDrop = useFetchQuickDrop();
  const receivedText = fetchDrop.data?.content ?? null;
  const error = fetchDrop.error?.message ?? null;

  const copyToClipboard = (text: string, label: string = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}!`, { position: "top-center" });
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/${url}`;
  };

  const handleView = (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeDropKey(key);
    if (normalized.length !== DROP_KEY_LENGTH) {
      toast.error("Enter the 6-character key");
      return;
    }
    fetchDrop.mutate({ url, key: normalized });
  };

  if (!receivedText && !error) {
    return (
      <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 mb-16 font-sans">
        <div className="animate-in fade-in duration-300">
          <form
            onSubmit={handleView}
            className="flex flex-col items-center justify-center min-h-[40vh] border border-border bg-card p-12 text-center rounded-none shadow-sm mt-10"
          >
            <div className="bg-primary/10 p-4 rounded-none mb-6">
              <Icons.lock size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Encrypted Drop
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Enter the 6-character key to decrypt this drop in your browser.
              The server cannot read it without the key.
            </p>
            <div className="w-full max-w-xs mb-6 text-left">
              <Label htmlFor="drop-key" className="mb-2 text-muted-foreground">
                Decrypt key
              </Label>
              <Input
                id="drop-key"
                value={key}
                onChange={(event) =>
                  setKey(normalizeDropKey(event.target.value).slice(0, DROP_KEY_LENGTH))
                }
                maxLength={DROP_KEY_LENGTH}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="XXXXXX"
                className="h-12 text-center font-mono text-lg tracking-[0.4em] uppercase"
              />
            </div>
            <Button
              type="submit"
              disabled={
                fetchDrop.isPending ||
                fetchDrop.isSuccess ||
                normalizeDropKey(key).length !== DROP_KEY_LENGTH
              }
              className="font-bold h-10 px-6 rounded-none bg-primary text-primary-foreground"
            >
              {fetchDrop.isPending ? (
                <Icons.loader2 className="animate-spin mr-2" />
              ) : (
                <Icons.lockOpen size={16} className="mr-2" />
              )}
              View Drop
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 mb-16 font-sans">
      {!receivedText ? (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col items-center justify-center min-h-[40vh] border border-border bg-card p-12 text-center rounded-none shadow-sm mt-10">
            <div className="bg-destructive/10 p-4 rounded-none mb-6">
              <Icons.warning size={32} className="text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {error === "Invalid key." ? "Invalid Key" : "Drop Not Found"}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {error === "Invalid key."
                ? "That key could not decrypt this drop. Check the key and try again."
                : error ||
                  "This drop may have expired, been burned, or the URL is incorrect."}
            </p>
            {error === "Invalid key." ? (
              <Button
                onClick={() => fetchDrop.reset()}
                className="font-bold h-10 px-6 rounded-none bg-primary text-primary-foreground"
              >
                Try again
              </Button>
            ) : (
              <Link href="/quickdrop" prefetch={true}>
                <Button className="font-bold h-10 px-6 rounded-none bg-primary text-primary-foreground">
                  Create New Drop
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4 mt-10">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(receivedText, "Text")}
                className="gap-2 h-10 px-4 font-medium rounded-none"
              >
                <Icons.copy size={16} />{" "}
                <span className="xs:inline md:inline">Copy Text</span>
                <Icons.caretDown
                  size={14}
                  className="ml-1 text-muted-foreground"
                />
              </Button>
            </div>

            <Link
              href="/quickdrop"
              prefetch={true}
              className="w-full sm:w-auto"
            >
              <Button className="font-bold h-10 px-5 shadow-none w-full sm:w-auto rounded-none text-black bg-[#ff9b66] hover:bg-[#ff8544] border-none">
                <Icons.plus weight="bold" size={16} className="mr-2" /> Create
                New Drop
              </Button>
            </Link>
          </div>

          <div className="bg-transparent border border-[#ff9b66]/60 p-4 sm:p-5 min-h-[200px] sm:min-h-[300px] text-foreground font-mono text-[13px] sm:text-sm leading-relaxed overflow-y-auto mb-6 shadow-inner rounded-none">
            {receivedText}
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center self-start">
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
      )}
    </div>
  );
}
