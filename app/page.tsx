import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import LandingPage from "@/components/landing/landing-page";
import DashboardPage from "@/components/dashboard/dashboard-page";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return <LandingPage />;
  }

  return <DashboardPage user={session.user} />;
}
