import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { createNote, getUserNotes } from "@/data-access/notes";
import { auth } from "@/features/auth/server";
import { noteSchema, notesQuerySchema } from "@/lib/schemas/notes";

export async function GET(req: NextRequest) {
  const t0 = performance.now();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const tAuth = performance.now();
    console.log(`[GET /api/notes] ⏱ Auth: ${(tAuth - t0).toFixed(1)}ms`);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rawQuery = {
      sort: searchParams.get("sort") ?? undefined,
      type: searchParams.get("type") ?? undefined,
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
    const tParse = performance.now();
    console.log(`[GET /api/notes] ⏱ Query parse: ${(tParse - tAuth).toFixed(1)}ms`);

    const result = await getUserNotes(session.user.id, parsed.data);
    const tDb = performance.now();
    console.log(`[GET /api/notes] ⏱ DB query: ${(tDb - tParse).toFixed(1)}ms`);
    console.log(`[GET /api/notes] ⏱ Total: ${(tDb - t0).toFixed(1)}ms`);

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
  const t0 = performance.now();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const tAuth = performance.now();
    console.log(`[POST /api/notes] ⏱ Auth: ${(tAuth - t0).toFixed(1)}ms`);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentTypeHeader = req.headers.get("content-type") || "";

    if (contentTypeHeader.includes("multipart/form-data")) {
      // --- File upload path (IMAGE / DOCUMENT) ---
      const formData = await req.formData();
      const tFormParse = performance.now();
      console.log(`[POST /api/notes] ⏱ FormData parse: ${(tFormParse - tAuth).toFixed(1)}ms`);

      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "Invalid payload", details: "No file provided" },
          { status: 400 },
        );
      }

      const title = formData.get("title") as string;
      if (!title || title.trim() === "") {
        return NextResponse.json(
          { error: "Invalid payload", details: "Title is required" },
          { status: 400 },
        );
      }

      console.log(`[POST /api/notes] 📄 File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${file.type})`);

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const tBuffer = performance.now();
      console.log(`[POST /api/notes] ⏱ File → Buffer: ${(tBuffer - tFormParse).toFixed(1)}ms`);

      const type = (formData.get("type") as string) || "IMAGE";
      const category = (formData.get("category") as string) || undefined;
      const contentType = (formData.get("contentType") as string) || file.type;
      const tags = formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [];
      const isProtected = formData.get("isProtected") === "true";
      const password = (formData.get("password") as string) || undefined;

      const tPreDb = performance.now();
      const note = await createNote(session.user.id, {
        title,
        content: "", // No content for file uploads
        type: type as "IMAGE" | "DOCUMENT",
        category,
        contentType,
        tags,
        isProtected,
        password,
        fileBuffer,
        fileName: file.name,
      });
      const tDb = performance.now();
      console.log(`[POST /api/notes] ⏱ R2 upload + DB create: ${(tDb - tPreDb).toFixed(1)}ms`);
      console.log(`[POST /api/notes] ⏱ Total: ${(tDb - t0).toFixed(1)}ms`);

      return NextResponse.json({ success: true, note });
    }

    // --- JSON path (TEXT / URL / MARKDOWN) ---
    const body = await req.json();
    const tJsonParse = performance.now();
    console.log(`[POST /api/notes] ⏱ JSON parse: ${(tJsonParse - tAuth).toFixed(1)}ms`);

    const result = noteSchema.safeParse(body);
    const tValidate = performance.now();
    console.log(`[POST /api/notes] ⏱ Schema validate: ${(tValidate - tJsonParse).toFixed(1)}ms`);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.format() },
        { status: 400 },
      );
    }

    const tPreDb = performance.now();
    const note = await createNote(session.user.id, result.data);
    const tDb = performance.now();
    console.log(`[POST /api/notes] ⏱ DB create: ${(tDb - tPreDb).toFixed(1)}ms`);
    console.log(`[POST /api/notes] ⏱ Total: ${(tDb - t0).toFixed(1)}ms`);

    return NextResponse.json({ success: true, note });
  } catch (error) {
    const tErr = performance.now();
    console.error(`[POST /api/notes] ❌ Error after ${(tErr - t0).toFixed(1)}ms:`, error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
