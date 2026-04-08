import { type NextRequest, NextResponse } from "next/server";

import {
  burnPrintToken,
  validateAndFetchPrintToken,
} from "@/features/print/server";
import { decryptString } from "@/lib/encryption";
import { downloadFileFromR2 } from "@/lib/r2";

/**
 * GET /api/print/[token]
 * Validates the one-time print token and serves the note content/file.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const record = await validateAndFetchPrintToken(token);

    if (!record) {
      return NextResponse.json(
        { error: "This secure link has expired or reached its usage limit." },
        { status: 410 },
      );
    }

    const { note } = record;
    const userId = note.user.id; // Owner's ID for decryption

    const title = decryptString(note.title, userId);
    const isFile = note.type === "IMAGE" || note.type === "DOCUMENT";

    if (isFile && note.fileKey) {
      const decryptedBuffer = await downloadFileFromR2(note.fileKey, userId);
      const contentType = note.contentType
        ? decryptString(note.contentType, userId)
        : "application/octet-stream";

      return new NextResponse(new Uint8Array(decryptedBuffer), {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${title}"`,
          "X-SECURE-PRINT": "VALID",
        },
      });
    } else {
      const content = decryptString(note.content, userId);
      return NextResponse.json({
        success: true,
        title,
        content,
        type: note.type,
      });
    }
  } catch (error) {
    console.error("API Error (GET /api/print/[token]):", error);
    return NextResponse.json(
      { error: "Internal security failure" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/print/[token]
 * Manually invalidates the token.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    await burnPrintToken(token);
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
}
