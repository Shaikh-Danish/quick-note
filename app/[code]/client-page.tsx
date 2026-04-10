"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/components/ui/toast";
import { useFetchQuickDrop } from "@/features/quick-drop/client";

export function QuickDropViewClient({ url }: { url: string }) {
  const router = useRouter();
  const [receivedText, setReceivedText] = useState<string | null>(null);
  const fetchMutation = useFetchQuickDrop();

  const qrBlocks = useMemo(() => {
    return Array.from({ length: 64 }).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      isDark: Math.random() > 0.5,
    }));
  }, []);

  const handleFetch = () => {
    fetchMutation.mutate(url, {
      onSuccess: (res) => {
        setReceivedText(res.content);
        toast.success("Text retrieved successfully!", {
          position: "top-center",
        });
      },
      onError: (err) => {
        toast.error(err.message || "Drop not found or expired.");
      },
    });
  };

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
            <div className="bg-muted p-4 rounded-none mb-6">
              <Icons.lock
                weight="fill"
                size={32}
                className="text-muted-foreground"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Locked Drop
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              This drop may be set to burn after reading. Click below to unlock
              and permanently consume the contents.
            </p>
            <Button
              onClick={handleFetch}
              disabled={fetchMutation.isPending}
              className="font-bold h-12 px-8 shadow-none transition-colors rounded-none text-black bg-[#ff9b66] hover:bg-[#ff8544] border-none"
            >
              {fetchMutation.isPending ? (
                <Icons.loader2 className="animate-spin mr-2" />
              ) : (
                <Icons.key weight="bold" size={18} className="mr-2" />
              )}
              Unlock Drop
            </Button>
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
              onClick={() => router.push("/quickdrop")}
              className="font-bold h-10 px-5 shadow-none w-full sm:w-auto rounded-none text-black bg-[#ff9b66] hover:bg-[#ff8544] border-none"
            >
              <Icons.plus weight="bold" size={16} className="mr-2" /> Create New
              Drop
            </Button>
          </div>

          {/* Text Area (Read Only) */}
          <div className="bg-transparent border border-[#ff9b66]/60 p-5 min-h-[300px] text-foreground font-mono text-sm leading-relaxed overflow-y-auto mb-6 shadow-inner rounded-none">
            {receivedText}
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
            {/* Functional QR Representation */}
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
      )}
    </div>
  );
}
