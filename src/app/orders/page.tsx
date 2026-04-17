import { db } from "@/db";
import { orders, customers } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Plus, ShoppingCart, Edit2 } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const [totalCount] = await db.select({ value: count() }).from(orders);
  
  const orderList = await db
    .select({
      id: orders.id,
      customerName: customers.name,
      status: orders.status,
      totalAmount: orders.totalAmount,
      amountPaid: orders.amountPaid,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(totalCount.value / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Orders</h2>
          <p className="text-sm md:text-base text-gray-400 font-medium">Track and manage your customer orders.</p>
        </div>
        <Link
          href="/orders/new"
          className="btn-primary w-full sm:w-auto"
        >
          <Plus size={18} className="mr-2" />
          New Order
        </Link>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-2xl md:rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Order ID</th>
                <th className="hidden sm:table-cell px-4 md:px-8 py-4 md:py-5 text-left text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Customer</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Status</th>
                <th className="hidden lg:table-cell px-4 md:px-8 py-4 md:py-5 text-left text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Total</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-right text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orderList.map((order) => {
                const total = parseFloat(order.totalAmount);
                const paid = parseFloat(order.amountPaid);
                const isFullyPaid = paid >= total;
                
                return (
                  <tr key={order.id} className="hover:bg-brand-sage/[0.02] transition-colors group">
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <span className="font-mono text-xs md:text-sm font-bold text-gray-400">ORD-{order.id.toString().padStart(5, '0')}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 md:px-8 py-4 md:py-5">
                      <span className="font-bold text-gray-800 text-sm md:text-base">{order.customerName || "Walk-in"}</span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5">
                      <div className="flex flex-col gap-1">
                        <span className={`status-badge capitalize ${
                          order.status === 'completed' || order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tighter ${isFullyPaid ? 'text-green-500' : 'text-orange-500'}`}>
                          {isFullyPaid ? 'Fully Paid' : 'Pending Payment'}
                        </span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 md:px-8 py-4 md:py-5">
                      <span className="font-extrabold text-gray-900 text-sm md:text-base">${total.toFixed(2)}</span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <Link 
                          href={`/orders/${order.id}`}
                          className="p-1.5 md:p-2 text-gray-400 hover:text-brand-sage hover:bg-brand-sage/5 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <DeleteButton 
                          id={order.id} 
                          module="orders" 
                          className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orderList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 md:px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <ShoppingCart size={40} />
                      </div>
                      <p className="text-sm text-gray-400 font-medium">No orders yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
