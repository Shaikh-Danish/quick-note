import { headers } from "next/headers";
import DashboardPage from "@/app/(dashboard)/_components/dashboard/dashboard-page";
import LandingPage from "@/app/(marketing)/_components/landing/landing-page";
import { auth } from "@/features/auth/server";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <LandingPage />;
  }

  return <DashboardPage user={session.user} />;
}
