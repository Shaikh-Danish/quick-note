import { type NextRequest, NextResponse } from "next/server";
import { fetchQuickDropFeature } from "@/features/quick-drop/server";
import { fetchQuickDropSchema } from "@/lib/schemas/quick-drop";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const parsed = fetchQuickDropSchema.safeParse({
      accessCode: resolvedParams.code.toUpperCase(),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid access code format." },
        { status: 400 },
      );
    }

    try {
      const result = await fetchQuickDropFeature(parsed.data.accessCode);
      return NextResponse.json(
        { success: true, data: result },
        { status: 200 },
      );
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Invalid or expired code." },
        { status: 404 },
      );
    }
  } catch (error: any) {
    console.error("Error fetching quick drop:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
