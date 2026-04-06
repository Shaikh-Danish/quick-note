import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { deleteNote } from "@/data-access/notes";
import { auth } from "@/features/auth/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.error("Delete API: No session found - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await deleteNote(session.user.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error (DELETE /api/notes/[id]):", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
