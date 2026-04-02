import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/features/auth/server";
import { getUserNotes, createNote } from "@/data-access/notes";
import { noteSchema } from "@/lib/schemas/notes";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await getUserNotes(session.user.id);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("API Error (GET /api/notes):", error);
    return NextResponse.json(
      { error: "Failed to load notes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = noteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.format() },
        { status: 400 },
      );
    }

    const note = await createNote(session.user.id, result.data);

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("API Error (POST /api/notes):", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
