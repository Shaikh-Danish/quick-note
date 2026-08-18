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

    let userId: string | undefined;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      userId = session?.user?.id;
    } catch {
      userId = undefined;
    }

    const result = await createQuickDropFeature(parsed.data, userId);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating quick drop:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
