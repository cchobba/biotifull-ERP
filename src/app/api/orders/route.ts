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

    // Use a transaction to ensure all operations succeed or none do
    const newOrder = await db.transaction(async (tx) => {
      // 1. Create the order
      const [order] = await tx
        .insert(orders)
        .values({
          customerId: parseInt(customerId),
          totalAmount: total.toString(),
          amountPaid: amountPaid.toString(),
          status: parseFloat(amountPaid) >= total ? "completed" : "pending",
        })
        .returning();

      // 2. Add order items and update stock
      for (const item of items) {
        // Insert line item
        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        });

        // Update product stock (Neon/Drizzle safe update)
        await tx
          .update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
          })
          .where(eq(products.id, item.productId));
      }

      // 3. Record initial payment if any
      if (parseFloat(amountPaid) > 0) {
        await tx.insert(payments).values({
          orderId: order.id,
          amount: amountPaid.toString(),
          method: "cash", // Default to cash for simplicity, can be expanded later
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
