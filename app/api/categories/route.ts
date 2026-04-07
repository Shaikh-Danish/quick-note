import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { auth } from "@/features/auth/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(categories);
  } catch (error) {
    console.error("API Error (GET /api/categories):", error);
    return Response.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}
