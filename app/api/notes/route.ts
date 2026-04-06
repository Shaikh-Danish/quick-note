import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { createNote, getUserNotes } from "@/data-access/notes";
import { auth } from "@/features/auth/server";
import { noteSchema, notesQuerySchema } from "@/lib/schemas/notes";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rawQuery = {
      sort: searchParams.get("sort") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    };

    const parsed = notesQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const result = await getUserNotes(session.user.id, parsed.data);

    return NextResponse.json(result);
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

    const contentTypeHeader = req.headers.get("content-type") || "";
    let result: { success: true; data: any } | { success: false; error: any };

    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "Invalid payload", details: "No file provided" },
          { status: 400 },
        );
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${fileBuffer.toString("base64")}`;

      const payload = {
        title: formData.get("title"),
        content: base64,
        category: formData.get("category"),
        contentType: formData.get("contentType") || file.type,
        tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [],
        isProtected: formData.get("isProtected") === "true",
        password: formData.get("password") || undefined,
      };

      result = noteSchema.safeParse(payload);
    } else {
      const body = await req.json();
      result = noteSchema.safeParse(body);
    }

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
