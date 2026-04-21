import { db } from "@/db";
import { orders, customers } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Plus, ShoppingCart, Edit2, ChevronRight, BookOpen, Clock } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";
import { formatCurrencyCompact } from "@/lib/format";

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
    <div className="max-w-[1400px] mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-secondary rounded-full"></span>
            <span className="label-sm-editorial text-secondary">The Botanical Journal</span>
          </div>
          <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">
            Transaction <span className="text-secondary italic">History</span>
          </h2>
          <p className="text-sm font-bold text-on-surface-variant opacity-60">Chronicling every botanical exchange.</p>
        </div>
        <Link href="/orders/new" className="btn-primary">
          <Plus size={18} className="mr-3" />
          Log New Exchange
        </Link>
      </div>

      {/* Orders Stream - Luminous Style */}
      <div className="space-y-4 px-2">
        <div className="grid grid-cols-12 px-8 py-4 opacity-30">
          <div className="col-span-6 lg:col-span-3 label-sm-editorial">Reference & Ambassador</div>
          <div className="hidden lg:block lg:col-span-3 label-sm-editorial">Current Flow State</div>
          <div className="hidden sm:block sm:col-span-3 lg:col-span-2 label-sm-editorial">Valuation</div>
          <div className="hidden lg:block lg:col-span-2 label-sm-editorial">Chronology</div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 text-right label-sm-editorial">Actions</div>
        </div>

        <div className="space-y-3">
          {orderList.map((order) => {
            const total = parseFloat(order.totalAmount);
            const paid = parseFloat(order.amountPaid);
            const isFullyPaid = paid >= total;
            
            return (
              <div key={order.id} className="grid grid-cols-12 items-center bg-surface-container-lowest p-6 rounded-[2rem] group hover:bg-surface-container-low transition-all shadow-[0_10px_30px_rgba(11,28,48,0.01)] border border-transparent hover:border-white/50">
                <div className="col-span-6 lg:col-span-3 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-secondary flex items-center justify-center font-mono font-black text-xs group-hover:scale-110 transition-transform">
                    {order.id.toString().padStart(3, '0')}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-black text-on-surface tracking-tight leading-tight">{order.customerName || "Walk-in"}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mt-1">ID: JOURNAL-{order.id}</span>
                  </div>
                </div>

                <div className="hidden lg:flex lg:col-span-3 items-center gap-4">
                  <span className={`status-badge capitalize font-black text-[10px] tracking-widest px-4 py-1.5 ${
                    order.status === 'completed' || order.status === 'delivered' ? 'bg-primary/10 text-primary' : 
                    order.status === 'pending' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary/10 text-secondary'
                  }`}>
                    {order.status}
                  </span>
                  {!isFullyPaid && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Pending Payment"></span>
                  )}
                </div>

                <div className="hidden sm:flex sm:col-span-3 lg:col-span-2 flex-col">
                  <span className="text-lg font-black text-on-surface tracking-tighter">{formatCurrencyCompact(total)}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isFullyPaid ? 'text-primary' : 'text-orange-500'}`}>
                    {isFullyPaid ? 'Settled' : `${formatCurrencyCompact(total - paid)} Remaining`}
                  </span>
                </div>

                <div className="hidden lg:flex lg:col-span-2 items-center gap-2 text-xs font-bold text-on-surface-variant opacity-40">
                  <Clock size={14} />
                  {order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2 flex items-center justify-end gap-2">
                  <Link 
                    href={`/orders/${order.id}`}
                    className="p-3 text-secondary hover:bg-white rounded-xl transition-all"
                  >
                    <Edit2 size={16} strokeWidth={3} />
                  </Link>
                  <DeleteButton 
                    id={order.id} 
                    module="orders" 
                    className="p-3 text-tertiary hover:bg-white rounded-xl transition-all"
                  />
                  <div className="p-3 text-on-surface/20 group-hover:text-primary transition-all">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orderList.length === 0 && (
          <div className="bg-surface-container-low p-20 rounded-[3rem] text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-on-surface-variant/20 shadow-sm">
              <BookOpen size={40} />
            </div>
            <div>
              <p className="text-xl font-display font-black text-on-surface tracking-tight">Journal Empty</p>
              <p className="text-sm font-bold text-on-surface-variant opacity-50 mt-1">No botanical transactions have been chronicled yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
