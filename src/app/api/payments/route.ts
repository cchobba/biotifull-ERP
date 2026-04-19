import { db } from "@/db";
import { payments, orders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { orderId, amount, method } = await req.json();

    if (!orderId || !amount) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return new NextResponse("Invalid payment amount", { status: 400 });
    }

    // Atomic transaction for payment and order update
    const newPayment = await db.transaction(async (tx) => {
      // 1. Record the payment
      const [payment] = await tx
        .insert(payments)
        .values({
          orderId,
          amount: paymentAmount.toFixed(2),
          method,
          reference: "Manual remittance recorded via Ledger",
        })
        .returning();

      // 2. Update the order total paid and status
      const [order] = await tx
        .select({
          totalAmount: orders.totalAmount,
          amountPaid: orders.amountPaid,
        })
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (!order) throw new Error("Order not found");

      const newTotalPaid = (parseFloat(order.amountPaid) + paymentAmount).toFixed(2);
      const isFullyPaid = parseFloat(newTotalPaid) >= parseFloat(order.totalAmount);

      await tx
        .update(orders)
        .set({
          amountPaid: newTotalPaid,
          status: isFullyPaid ? "completed" : undefined, // Auto-complete if paid
        })
        .where(eq(orders.id, orderId));

      return payment;
    });

    return NextResponse.json(newPayment);
  } catch (error: any) {
    console.error("Payment recording error:", error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
