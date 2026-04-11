import { headers } from "next/headers";

import { DashboardHeader } from "@/app/(dashboard)/_components/dashboard/layout";
import { auth } from "@/features/auth/server";
import { fetchQuickDropFeature } from "@/features/quick-drop/server";
import { QuickDropViewClient } from "./client-page";

export default async function DropPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let dropData: { content: string } | null = null;
  let error: string | null = null;

  try {
    dropData = await fetchQuickDropFeature(code);
  } catch (e: any) {
    error = e.message || "Drop not found or expired.";
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <DashboardHeader user={session?.user || null} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <QuickDropViewClient
            url={code}
            initialContent={dropData?.content || null}
            initialError={error}
          />
        </div>
      </main>
    </div>
  );
}
