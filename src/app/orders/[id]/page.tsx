import { db } from "@/db";
import { orders, customers, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ShoppingBag, User, Calendar, CreditCard } from "lucide-react";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id);

  const [order] = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      amountPaid: orders.amountPaid,
      createdAt: orders.createdAt,
      customerName: customers.name,
      customerEmail: customers.email,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    notFound();
  }

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      priceAtPurchase: orderItems.priceAtPurchase,
      productName: products.name,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  async function updateOrderStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    redirect("/orders");
  }

  const total = parseFloat(order.totalAmount);
  const paid = parseFloat(order.amountPaid);
  const remaining = total - paid;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Order ORD-{order.id.toString().padStart(5, '0')}</h2>
        </div>
        <span className={`status-badge px-4 py-1.5 text-sm uppercase tracking-widest ${
          order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Order Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)]">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingBag size={20} className="text-brand-sage" />
              Order Items
            </h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-bold text-gray-800">{item.productName}</p>
                    <p className="text-xs text-gray-400 font-medium">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-extrabold text-gray-700">${(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-brand-sage/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold text-gray-700">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg pt-2">
                <span className="text-gray-800 font-bold">Total Amount</span>
                <span className="font-black text-brand-terracotta">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Status Update */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-brand-sage/10 shadow-sm">
            <h3 className="text-sm font-bold text-brand-sage-dark uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} />
              Customer
            </h3>
            <p className="font-bold text-gray-800">{order.customerName || "Walk-in"}</p>
            <p className="text-xs text-gray-400 truncate">{order.customerEmail || "No email"}</p>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Calendar size={14} />
                {order.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="bg-brand-sage/5 p-6 rounded-[2rem] border border-brand-sage/10">
            <h3 className="text-sm font-bold text-brand-sage-dark uppercase tracking-widest mb-4 flex items-center gap-2">
              <CreditCard size={16} />
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-tight">Paid</span>
                <span className="text-sm font-extrabold text-green-600">${paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-tight">Balance</span>
                <span className={`text-sm font-extrabold ${remaining > 0 ? 'text-red-500' : 'text-gray-400'}`}>${remaining.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form action={updateOrderStatus} className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-brand-sage/10 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Update Status</h3>
            <select name="status" defaultValue={order.status} className="input-field py-2 text-sm">
              <option value="pending">Pending</option>
              <option value="on hold">On Hold</option>
              <option value="processing">Processing</option>
              <option value="in transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button type="submit" className="btn-primary w-full text-xs">
              <Save size={14} className="mr-2" />
              Update Status
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
