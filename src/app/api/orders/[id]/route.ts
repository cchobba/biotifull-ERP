import { db } from "@/db";
import { orders } from "@/db/schema";
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
    const orderId = parseInt(id);
    
    // Note: In a real app, you might want to handle dependent order items 
    // depending on your database schema (CASCADE vs RESTRICT)
    await db.delete(orders).where(eq(orders.id, orderId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete order error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
