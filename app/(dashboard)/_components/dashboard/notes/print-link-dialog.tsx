import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";

interface PrintLinkDialogProps {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrintLinkDialog({ url, open, onOpenChange }: PrintLinkDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (_err) {
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-border bg-card shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            <Icons.printer size={18} className="text-primary" />
            Print Link Ready
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground/70 leading-relaxed font-medium">
              Share this secure, one-time link with your print station.
              It will expire automatically after <span className="text-foreground font-bold underline decoration-primary/30">5 minutes</span> or after the session window closes.
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 group">
                <Input
                  value={url}
                  readOnly
                  className="h-11 bg-muted/30 border-border/40 font-mono text-[10px] pr-10 rounded-none focus-visible:ring-primary/20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors">
                  <Icons.lock size={12} />
                </div>
              </div>
              <Button
                size="icon"
                onClick={handleCopy}
                className="h-11 w-11 shrink-0 rounded-none shadow-none border border-primary/20 hover:border-primary transition-colors"
                variant={copied ? "outline" : "default"}
              >
                {copied ? (
                  <Icons.check size={16} className="text-green-500" />
                ) : (
                  <Icons.copy size={16} />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-none border-dashed">
            <div className="mt-0.5">
              <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Icons.info size={10} className="text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Security Notice</h4>
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                The document is decrypted on-demand and is never stored in its raw format on the link server.
                Manual invalidation is triggered the moment the print dialog is closed.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t border-border/30 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-xs font-bold uppercase tracking-widest h-8"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
