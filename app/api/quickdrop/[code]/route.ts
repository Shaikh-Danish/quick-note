import { type NextRequest, NextResponse } from "next/server";
import { fetchQuickDropFeature } from "@/features/quick-drop/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const url = resolvedParams.code;

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Invalid URL string format." },
        { status: 400 },
      );
    }

    try {
      const result = await fetchQuickDropFeature(url);
      return NextResponse.json(
        { success: true, data: result },
        { status: 200 },
      );
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: e.message || "Invalid or expired URL." },
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
