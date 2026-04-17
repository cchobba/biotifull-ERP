import { db } from "@/db";
import { customers, products } from "@/db/schema";
import { OrderForm } from "@/components/order-form";
import { eq } from "drizzle-orm";

export default async function NewOrderPage() {
  const customerList = await db.select({ id: customers.id, name: customers.name }).from(customers);
  const productList = await db.select().from(products).where(eq(products.isActive, true));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
      <OrderForm customers={customerList} products={productList} />
    </div>
  );
}
