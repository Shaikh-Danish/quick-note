import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { incrementNoteCopyCount } from "@/data-access/notes";
import { auth } from "@/features/auth/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.error("Copy API: No session found - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const updated = await incrementNoteCopyCount(session.user.id, id);

    return NextResponse.json({ success: true, useCount: updated.useCount });
  } catch (error) {
    console.error("API Error (POST /api/notes/[id]/copy):", error);
    return NextResponse.json(
      { error: "Failed to increment copy count" },
      { status: 500 },
    );
  }
}
