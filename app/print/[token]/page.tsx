"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

import { useBurnPrintToken, usePrintDocument } from "@/features/print/client";
import type { PrintDocResponse } from "@/lib/schemas/print";

export default function PrintPage() {
  const { token } = useParams();
  const printToken = typeof token === "string" ? token : "";

  const { data, isLoading, isError, error } = usePrintDocument(printToken);
  const burnMutation = useBurnPrintToken();
  const printTriggered = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle Printing once data is loaded
  const handlePrint = useCallback(() => {
    const docData = data as PrintDocResponse & { binaryUrl?: string };
    if (!docData) return;

    if (docData.type === "DOCUMENT" && iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.focus();
        iframeRef.current.contentWindow?.print();
      } catch (_e) {
        window.print();
      }
    } else {
      window.print();
    }
    burnMutation.mutate(printToken);
  }, [data, printToken, burnMutation]);

  useEffect(() => {
    if (data && !isLoading && !printTriggered.current) {
      printTriggered.current = true;
      const timer = setTimeout(() => {
        handlePrint();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data, isLoading, handlePrint]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
        <div className="size-16 bg-white border border-zinc-200 shadow-sm flex items-center justify-center mb-6">
          <Icons.notebook size={32} className="text-zinc-900 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Decrypting Secure Stream
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-6 text-center">
        <div className="size-14 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Icons.warning size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Access Revoked</h1>
        <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
          {error instanceof Error ? error.message : "This link has expired or reached its maximum access limit."}
        </p>
        <div className="mt-12 flex items-center gap-3 opacity-20">
          <Icons.notebook size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Quick Note</span>
        </div>
      </div>
    );
  }

  // Cast binaryUrl properly for typed access
  const docData = data as PrintDocResponse & { binaryUrl?: string };

  return (
    <div className="min-h-screen bg-zinc-100/50 text-black py-12 px-4 print:p-0 print:bg-white">
      {/* Professional Header */}
      <div className="max-w-4xl mx-auto mb-10 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-black flex items-center justify-center">
            <Icons.notebook className="text-white" size={20} weight="fill" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-zinc-900">
              Quick Note
            </h1>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">
              Secure Print Station
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="bg-black text-white px-6 h-10 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
        >
          <Icons.printer size={14} weight="bold" />
          Print Document
        </button>
      </div>

      {/* Document Sheet */}
      <main className="max-w-4xl mx-auto bg-white shadow-2xl border border-zinc-200 min-h-[11in] p-[1in] relative print:shadow-none print:border-none print:p-0 print:min-h-0">
        <div className={cn(
          "mb-12 border-b border-zinc-100 pb-8",
          (docData.type === "IMAGE" || docData.type === "DOCUMENT") && "print:hidden"
        )}>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            {docData.title}
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-1 border border-zinc-100">
              {docData.type}
            </span>
            <span className="text-[10px] font-mono text-zinc-300">
              ID: {printToken.slice(0, 8)}...
            </span>
          </div>
        </div>

        <div className="document-content">
          {docData.type === "IMAGE" && docData.binaryUrl && (
            <div className="flex justify-center print:block">
              <Image
                src={docData.binaryUrl}
                alt={docData.title}
                width={1600}
                height={1200}
                className="max-w-full h-auto print:w-full print:h-auto"
                unoptimized
              />
            </div>
          )}

          {docData.type === "DOCUMENT" && docData.binaryUrl && (
            <div className="text-center py-20 border-2 border-dashed border-zinc-100 bg-zinc-50/50 print:p-0 print:border-none print:bg-transparent">
              <div className="print:hidden">
                <Icons.filePdf size={64} className="mx-auto mb-6 text-zinc-400" />
                <p className="text-lg font-bold text-zinc-900">Digital Document Ready</p>
                <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Your file has been decrypted. If the print dialog didn't appear, use the button above.
                </p>
              </div>
              <iframe
                ref={iframeRef}
                title="Secure Document View"
                src={docData.binaryUrl}
                className="hidden"
              />
            </div>
          )}

          {docData.content && (
            <div className="prose prose-zinc max-w-none">
              <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-zinc-800">
                {docData.content}
              </div>
            </div>
          )}
        </div>

        {/* Footer info (only visible on printed version usually) */}
        <div className="mt-20 pt-8 border-t border-zinc-50 flex items-center justify-between opacity-30">
          <p className="text-[8px] font-mono uppercase tracking-widest">
            Generated via Quick Note Secure Infrastructure
          </p>
          <p className="text-[8px] font-mono">
            {new Date().toISOString()}
          </p>
        </div>
      </main>

      <div className="max-w-4xl mx-auto mt-8 flex items-center justify-center gap-6 print:hidden">
         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
            <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />
            Ephemeral Session
         </div>
         <div className="w-px h-3 bg-zinc-200" />
         <p className="text-[9px] font-medium text-zinc-300 uppercase tracking-widest">
            Data will be purged from browser memory on close
         </p>
      </div>
    </div>
  );
}
