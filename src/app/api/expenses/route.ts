import { db } from "@/db";
import { expenses } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { description, amount, category, providerId, reference, date } = await req.json();

    const [expense] = await db
      .insert(expenses)
      .values({
        description,
        amount: amount.toString(),
        category,
        providerId: providerId ? parseInt(providerId) : null,
        reference,
        date: new Date(date),
      })
      .returning();

    return NextResponse.json(expense);
  } catch (error: any) {
    console.error("Expense creation error:", error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
