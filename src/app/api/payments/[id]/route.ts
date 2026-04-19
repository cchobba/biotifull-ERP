import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const paymentId = parseInt(id);
    
    await db.delete(payments).where(eq(payments.id, paymentId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete payment error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
