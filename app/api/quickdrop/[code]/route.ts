import { type NextRequest, NextResponse } from "next/server";
import {
  burnQuickDropFeature,
  fetchQuickDropFeature,
} from "@/features/quick-drop/server";

export const dynamic = "force-dynamic";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const url = resolvedParams.code?.trim();

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
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
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

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const url = resolvedParams.code?.trim();

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Invalid URL string format." },
        { status: 400 },
      );
    }

    await burnQuickDropFeature(url);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: any) {
    console.error("Error burning quick drop:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
