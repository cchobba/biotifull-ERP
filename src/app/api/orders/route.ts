import { db } from "@/db";
import { orders, orderItems, products, payments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    console.log("Order creation started. Body:", JSON.stringify(body));

    const { customerId, items, total, amountPaid } = body;
    
    // Validate inputs
    if (!customerId || isNaN(parseInt(customerId))) {
      return new NextResponse("Invalid Customer ID", { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("No items provided", { status: 400 });
    }

    const finalAmountPaid = amountPaid || "0";
    const totalNum = parseFloat(total);
    const paidNum = parseFloat(finalAmountPaid);

    if (isNaN(totalNum) || isNaN(paidNum)) {
      return new NextResponse("Invalid total or amount paid", { status: 400 });
    }

    // Neon-optimized transaction
    const newOrder = await db.transaction(async (tx) => {
      console.log("Starting transaction...");

      // 1. Create the order
      const [order] = await tx
        .insert(orders)
        .values({
          customerId: parseInt(customerId),
          totalAmount: totalNum.toFixed(2),
          amountPaid: paidNum.toFixed(2),
          status: paidNum >= totalNum ? "completed" : "pending",
        })
        .returning();

      console.log("Order created:", order.id);

      // 2. Add order items and update stock
      for (const item of items) {
        const pId = parseInt(item.productId);
        const qty = parseInt(item.quantity);
        const price = parseFloat(item.price);

        if (isNaN(pId) || isNaN(qty) || isNaN(price)) {
          throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
        }

        console.log(`Processing item: Product ${pId}, Qty ${qty}`);

        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: pId,
          quantity: qty,
          priceAtPurchase: price.toFixed(2),
        });

        // Get current stock
        const [product] = await tx
          .select({ stockQuantity: products.stockQuantity })
          .from(products)
          .where(eq(products.id, pId))
          .limit(1);

        if (product) {
          console.log(`Updating stock for ${pId}: ${product.stockQuantity} -> ${product.stockQuantity - qty}`);
          await tx
            .update(products)
            .set({
              stockQuantity: product.stockQuantity - qty,
            })
            .where(eq(products.id, pId));
        } else {
          throw new Error(`Product ${pId} not found during stock update`);
        }
      }

      // 3. Record initial payment if any
      if (paidNum > 0) {
        console.log("Recording initial payment...");
        await tx.insert(payments).values({
          orderId: order.id,
          amount: paidNum.toFixed(2),
          method: "cash",
          reference: "Initial payment during order creation",
        });
      }

      return order;
    });

    console.log("Order creation successful!");
    return NextResponse.json(newOrder);
  } catch (error: any) {
    console.error("CRITICAL: Order creation error:", error);
    // Return detailed error message to help debugging
    return new NextResponse(`Server Error: ${error.message || "Unknown error"}`, { status: 500 });
  }
}
