import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/server";
import { createQuickDropFeature } from "@/features/quick-drop/server";
import { createQuickDropSchema } from "@/lib/schemas/quick-drop";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createQuickDropSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payload format." },
        { status: 400 },
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const result = await createQuickDropFeature(parsed.data, session?.user?.id);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating quick drop:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
