"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icons } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { useBurnPrintToken, usePrintDocument } from "@/features/print/client";
import type { PrintDocResponse } from "@/lib/schemas/print";

export default function PrintPage() {
  const { token } = useParams();
  const printToken = typeof token === "string" ? token : "";

  const { data, isLoading, isError, error } = usePrintDocument(printToken);
  const burnMutation = useBurnPrintToken();
  const printTriggered = useRef(false);

  // Handle Printing once data is loaded
  useEffect(() => {
    if (data && !isLoading && !printTriggered.current) {
      printTriggered.current = true;

      const timer = setTimeout(() => {
        window.print();
        burnMutation.mutate(printToken);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [data, isLoading, printToken, burnMutation]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Spinner className="mb-4" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          Verifying Secure Channel...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-6 text-center">
        <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Icons.warning size={24} className="text-red-500" />
        </div>
        <h1 className="text-lg font-bold text-zinc-900 mb-2">Access Denied</h1>
        <p className="text-sm text-zinc-500 max-w-xs">
          {error instanceof Error ? error.message : "Security Failure"}
        </p>
        <p className="mt-8 text-[10px] uppercase tracking-tighter text-zinc-300">
          Quick Note Secure Print v1.0
        </p>
      </div>
    );
  }

  // Cast binaryUrl properly for typed access
  const docData = data as PrintDocResponse & { binaryUrl?: string };

  return (
    <div className="min-h-screen bg-white text-black p-8 print:p-0">
      <div className="mb-8 border-b border-zinc-100 pb-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Secure Session Active
          </span>
        </div>
        <p className="text-[10px] font-mono text-zinc-300">
          Printing: {docData.title}
        </p>
      </div>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 print:hidden">
          {docData.title}
        </h1>

        {docData.type === "IMAGE" && docData.binaryUrl && (
          <div className="flex justify-center">
            <Image
              src={docData.binaryUrl}
              alt={docData.title}
              width={1600}
              height={1200}
              className="max-w-full h-auto shadow-sm print:shadow-none"
              unoptimized
            />
          </div>
        )}

        {docData.type === "DOCUMENT" && docData.binaryUrl && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-lg print:hidden">
            <Icons.filePdf size={48} className="mx-auto mb-4 text-zinc-400" />
            <p className="text-sm font-medium">Document Ready for Printing</p>
            <p className="text-xs text-zinc-400 mt-1">
              If the print dialog didn't open, please refresh or press Ctrl+P
            </p>
            <iframe
              title="Secure Document View"
              src={docData.binaryUrl}
              className="hidden"
            />
          </div>
        )}

        {docData.content && (
          <div className="prose prose-sm max-w-none text-black">
            <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed">
              {docData.content}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 pt-8 border-t border-zinc-100 print:hidden text-center">
        <p className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
          This document will be inaccessible after this session.
        </p>
      </footer>
    </div>
  );
}
