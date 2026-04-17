import { db } from "@/db";
import { orders, orderItems, products, payments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { customerId, items, total, amountPaid } = await req.json();
    const finalAmountPaid = amountPaid || "0";

    // Neon-optimized transaction
    const newOrder = await db.transaction(async (tx) => {
      // 1. Create the order
      const [order] = await tx
        .insert(orders)
        .values({
          customerId: parseInt(customerId),
          totalAmount: total.toFixed(2),
          amountPaid: parseFloat(finalAmountPaid).toFixed(2),
          status: parseFloat(finalAmountPaid) >= total ? "completed" : "pending",
        })
        .returning();

      // 2. Add order items and update stock
      for (const item of items) {
        const pId = parseInt(item.productId);
        const qty = parseInt(item.quantity);

        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: pId,
          quantity: qty,
          priceAtPurchase: parseFloat(item.price).toFixed(2),
        });

        // Get current stock
        const [product] = await tx
          .select({ stockQuantity: products.stockQuantity })
          .from(products)
          .where(eq(products.id, pId))
          .limit(1);

        if (product) {
          // Update stock manually to be safe
          await tx
            .update(products)
            .set({
              stockQuantity: product.stockQuantity - qty,
            })
            .where(eq(products.id, pId));
        }
      }

      // 3. Record initial payment if any
      if (parseFloat(finalAmountPaid) > 0) {
        await tx.insert(payments).values({
          orderId: order.id,
          amount: parseFloat(finalAmountPaid).toFixed(2),
          method: "cash",
          reference: "Initial payment during order creation",
        });
      }

      return order;
    });

    return NextResponse.json(newOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
