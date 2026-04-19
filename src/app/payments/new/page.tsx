import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { eq, and, gt, sql } from "drizzle-orm";
import { NewPaymentForm } from "@/components/new-payment-form";

export default async function NewPaymentPage() {
  // Fetch customers who have pending/active orders
  const customerList = await db
    .select({ id: customers.id, name: customers.name })
    .from(customers);

  // Fetch orders with remaining balances
  const pendingOrders = await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      totalAmount: orders.totalAmount,
      amountPaid: orders.amountPaid,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(
      sql`${orders.totalAmount} > ${orders.amountPaid}`
    );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-2 px-2">
        <div className="flex items-center gap-3">
          <span className="w-12 h-[2px] bg-tertiary rounded-full"></span>
          <span className="label-sm-editorial text-tertiary">Financial Reconciliation</span>
        </div>
        <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">
          Record <span className="text-tertiary italic">Remittance</span>
        </h2>
        <p className="text-sm font-bold text-on-surface-variant opacity-60">Settling accounts with precision and transparency.</p>
      </div>

      <NewPaymentForm 
        customers={customerList} 
        initialOrders={pendingOrders} 
      />
    </div>
  );
}
