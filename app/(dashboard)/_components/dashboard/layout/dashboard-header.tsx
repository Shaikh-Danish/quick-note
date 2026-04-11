"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/features/auth/client";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  } | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const signout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  const NavLinks = ({ className = "" }: { className?: string }) => (
    <>
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className={`relative h-full flex items-center text-sm font-medium transition-colors ${pathname === "/" || pathname === "/dashboard"
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
          } ${className}`}
      >
        Notes
        {(pathname === "/" || pathname === "/dashboard") && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-t-full hidden md:block" />
        )}
      </Button>
      <Button
        variant="ghost"
        onClick={() => router.push("/quickdrop")}
        className={`relative h-full flex items-center text-sm font-medium transition-colors ${pathname?.startsWith("/quickdrop")
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
          } ${className}`}
      >
        QuickDrop
        {pathname?.startsWith("/quickdrop") && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-t-full hidden md:block" />
        )}
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div className="flex justify-between h-14 items-center">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-1">
            <Sheet>
              <SheetTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8 -ml-2 text-muted-foreground/60"
                >
                  <Icons.list size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <SheetHeader className="mt-4 border-b border-border/50 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center rounded">
                      <Icons.notebook
                        weight="fill"
                        className="text-primary-foreground"
                        size={16}
                      />
                    </div>
                    <SheetTitle className="font-black text-xs uppercase tracking-[0.2em]">
                      Quick Note
                    </SheetTitle>
                  </div>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                  <NavLinks className="justify-start px-4 h-11" />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary flex items-center justify-center rounded">
                <Icons.notebook
                  weight="fill"
                  className="text-primary-foreground"
                  size={15}
                />
              </div>
              <h1 className="font-black text-xs uppercase tracking-[0.2em] hidden xs:block text-foreground">
                Quick Note
              </h1>
            </div>
          </div>

          {/* Navigation - Minimalist Line Tabs (Desktop) */}
          <nav className="hidden md:flex flex-none items-center gap-8 h-full">
            <NavLinks />
          </nav>

          {/* Actions */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <div className="flex flex-col items-end mr-1 min-w-0">
              <span className="text-xs font-bold text-foreground tracking-tight truncate max-w-[100px] sm:max-w-none">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] text-muted-foreground/50 font-mono truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px]">
                {user?.email}
              </span>
            </div>

            <div className="w-px h-6 bg-border/40" />

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-full"
                aria-label="Toggle theme"
              >
                <Icons.sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Icons.moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={signout}
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-full cursor-pointer"
                title="Sign out"
              >
                <Icons.signOut size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
