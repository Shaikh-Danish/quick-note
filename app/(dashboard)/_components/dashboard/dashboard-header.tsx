import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <Icons.notebook
                weight="fill"
                className="text-primary-foreground"
                size={18}
              />
            </div>
            <h1 className="font-bold text-lg hidden sm:block tracking-tight text-foreground">
              Quick Note
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-8 group hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Icons.magnifyingGlass size={16} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-border leading-5 bg-secondary placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-ring dark:placeholder-zinc-600 sm:text-sm transition-all focus:bg-background"
                placeholder="Find a shortcut..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-sm mr-2">
              <span className="font-semibold text-foreground">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate w-32 text-right">
                {user?.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              <Icons.sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icons.moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              onClick={signout}
              className="p-2.5 bg-secondary text-muted-foreground hover:text-foreground dark:hover:text-primary-foreground transition-colors border border-transparent hover:border-border active:scale-95"
              title="Sign out"
            >
              <Icons.signOut size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
