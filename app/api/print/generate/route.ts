import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/server";
import { generateSecurePrintLink } from "@/features/print/server";
import { generatePrintTokenSchema } from "@/lib/schemas/print";

/**
 * POST /api/print/generate
 * Generates a secure, one-time-use print URL for a specific note.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generatePrintTokenSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const token = await generateSecurePrintLink(
      parsed.data.noteId,
      session.user.id,
    );

    // Build the full public URL
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = req.headers.get("host");
    const printUrl = `${protocol}://${host}/print/${token}`;

    return NextResponse.json({ success: true, url: printUrl });
  } catch (error) {
    console.error("API Error (POST /api/print/generate):", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate print link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
