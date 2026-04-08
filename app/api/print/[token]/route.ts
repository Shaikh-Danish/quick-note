import { type NextRequest, NextResponse } from "next/server";

import {
  burnPrintToken,
  validateAndFetchPrintToken,
} from "@/features/print/server";
import { decryptString, decryptWithPassword } from "@/lib/encryption";
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

    const { note, accessKey } = record;
    const userId = note.user.id; // Owner's ID for decryption

    // 1. Initial System Decryption
    let title = decryptString(note.title, userId);
    let contentType = note.contentType
      ? decryptString(note.contentType, userId)
      : "application/octet-stream";

    // 2. Secondary Password Decryption (if applicable)
    if (note.isProtected && accessKey) {
      try {
        title = decryptWithPassword(title, accessKey);
        contentType = note.contentType ? decryptWithPassword(contentType, accessKey) : contentType;
      } catch (_err) {
        // If title/contentType weren't password-encrypted (some old notes), keep original
      }
    }

    const isFile = note.type === "IMAGE" || note.type === "DOCUMENT";

    if (isFile && note.fileKey) {
      const decryptedBuffer = await downloadFileFromR2(note.fileKey, userId);

      return new NextResponse(new Uint8Array(decryptedBuffer), {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${title}"`,
          "X-SECURE-PRINT": "VALID",
        },
      });
    } else {
      let content = decryptString(note.content, userId);
      
      if (note.isProtected && accessKey) {
        try {
          content = decryptWithPassword(content, accessKey);
        } catch (_err) {
            return NextResponse.json({ error: "Access key mismatch for protected document" }, { status: 403 });
        }
      }

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
