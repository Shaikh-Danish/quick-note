import { headers } from "next/headers";

import { DashboardHeader } from "@/app/(dashboard)/_components/dashboard/layout";
import { auth } from "@/features/auth/server";
import { QuickDropViewClient } from "./client-page";

export const dynamic = "force-dynamic";

export default async function DropPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let user: { name?: string | null; email: string; image?: string | null } | null =
    null;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    user = session?.user ?? null;
  } catch {
    user = null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <DashboardHeader user={user} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <QuickDropViewClient url={code.trim().toUpperCase()} />
        </div>
      </main>
    </div>
  );
}
