import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/features/auth/server";
import { decryptString } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { downloadFileFromR2 } from "@/lib/r2";

/**
 * GET /api/notes/[id]/file
 * Streams the decrypted file from R2 for file-based notes.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const t0 = performance.now();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: { id, userId: session.user.id },
      select: { fileKey: true, contentType: true, title: true, isProtected: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (!note.fileKey) {
      return NextResponse.json({ error: "Not a file-based note" }, { status: 400 });
    }

    const tDb = performance.now();

    // Download and decrypt from R2
    const decryptedBuffer = await downloadFileFromR2(note.fileKey, session.user.id);
    const tR2 = performance.now();
    console.log(`[GET /api/notes/${id}/file] ⏱ R2 download + decrypt: ${(tR2 - tDb).toFixed(1)}ms (${(decryptedBuffer.length / 1024 / 1024).toFixed(2)}MB)`);

    const contentType = note.contentType ?? "application/octet-stream";

    const title = note.title;
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9._-]/g, "_");

    console.log(`[GET /api/notes/${id}/file] ⏱ Total: ${(performance.now() - t0).toFixed(1)}ms`);

    return new NextResponse(new Uint8Array(decryptedBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(decryptedBuffer.length),
        "Content-Disposition": `inline; filename="${sanitizedTitle}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error(`[GET /api/notes/[id]/file] ❌ Error:`, error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
}
