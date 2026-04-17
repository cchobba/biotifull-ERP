import { db } from "@/db";
import { customers } from "@/db/schema";
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
    const customerId = parseInt(id);
    
    await db.delete(customers).where(eq(customers.id, customerId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
