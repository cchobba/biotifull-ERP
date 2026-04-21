import { db } from "@/db";
import { providers } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { name } = await req.json();
    const [provider] = await db.insert(providers).values({ name }).returning();
    return NextResponse.json(provider);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
