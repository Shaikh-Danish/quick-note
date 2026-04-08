import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";

interface PrintPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => void;
  isPending: boolean;
}

export function PrintPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: PrintPasswordDialogProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      onConfirm(password);
      setPassword(""); // Clear after confirm
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px] p-0 overflow-hidden border border-border bg-card shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <div className="size-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 mx-auto">
            <Icons.password size={20} className="text-primary" />
          </div>
          <DialogTitle className="text-lg font-black uppercase tracking-tight text-center">
            Authorization Required
          </DialogTitle>
          <DialogDescription className="text-[10px] text-muted-foreground/60 text-center uppercase tracking-widest font-bold">
            Unlock note for print station
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div className="space-y-4">
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-medium text-center">
              Please enter the password for this note. This key will be securely attached to your temporary print link.
            </p>

            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 bg-muted/30 border-border/40 font-mono text-center tracking-widest focus-visible:ring-primary/20"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isPending || !password}
              className="h-10 w-full text-[10px] font-black uppercase tracking-widest rounded-none shadow-none"
            >
              {isPending ? "Generating Link..." : "Confirm & Generate"}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 w-full text-[10px] font-bold uppercase tracking-widest"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
