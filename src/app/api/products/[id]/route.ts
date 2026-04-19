import { db } from "@/db";
import { products } from "@/db/schema";
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
    const productId = parseInt(id);
    
    await db.delete(products).where(eq(products.id, productId));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete product error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
