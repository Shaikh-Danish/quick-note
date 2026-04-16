"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/components/ui/toast";

export function QuickDropViewClient({
  url,
  initialContent,
  initialError,
}: {
  url: string;
  initialContent: string | null;
  initialError: string | null;
}) {
  const [receivedText] = useState<string | null>(initialContent);

  const copyToClipboard = (text: string, label: string = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}!`, { position: "top-center" });
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/${url}`;
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 mb-16 font-sans">
      {!receivedText ? (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col items-center justify-center min-h-[40vh] border border-border bg-card p-12 text-center rounded-none shadow-sm mt-10">
            <div className="bg-destructive/10 p-4 rounded-none mb-6">
              <Icons.warning size={32} className="text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Drop Not Found
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {initialError ||
                "This drop may have expired, been burned, or the URL is incorrect."}
            </p>
            <Link href="/quickdrop" prefetch={true}>
              <Button className="font-bold h-10 px-6 rounded-none bg-primary text-primary-foreground">
                Create New Drop
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {/* Top Toolbar */}
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
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground gap-2 font-medium rounded-none px-2 sm:px-4"
              >
                <Icons.warning size={16} />{" "}
                <span className="hidden xs:inline">Report Drop</span>
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

          {/* Text Area (Read Only) */}
          <div className="bg-transparent border border-[#ff9b66]/60 p-4 sm:p-5 min-h-[200px] sm:min-h-[300px] text-foreground font-mono text-[13px] sm:text-sm leading-relaxed overflow-y-auto mb-6 shadow-inner rounded-none">
            {receivedText}
          </div>

          {/* Bottom Bar: Access URL */}
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
            {/* Functional QR Representation */}
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
