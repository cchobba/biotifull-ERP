import { db } from "@/db";
import { payments, orders, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { DeleteButton } from "@/components/delete-button";
import { CreditCard, Wallet, ArrowDownRight, History } from "lucide-react";

export default async function PaymentsPage() {
  const paymentList = await db
    .select({
      id: payments.id,
      paymentAmount: payments.amount,
      method: payments.method,
      paidAt: payments.paidAt,
      orderId: orders.id,
      orderTotal: orders.totalAmount,
      orderPaidTotal: orders.amountPaid,
      customerName: customers.name,
    })
    .from(payments)
    .innerJoin(orders, eq(payments.orderId, orders.id))
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(payments.paidAt));

  return (
    <div className="max-w-[1400px] mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-tertiary rounded-full"></span>
            <span className="label-sm-editorial text-tertiary">Financial Sovereignty</span>
          </div>
          <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">
            The <span className="text-tertiary italic">Luminous</span> Ledger
          </h2>
          <p className="text-sm font-bold text-on-surface-variant opacity-60">Architecting your financial transparency.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low px-6 py-3 rounded-2xl border border-white/50 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest text-on-surface/40">Audit Live</span>
          </div>
        </div>
      </div>

      {/* Ledger Stream - Luminous Style */}
      <div className="space-y-4 px-2">
        <div className="grid grid-cols-12 px-8 py-4 opacity-30">
          <div className="col-span-6 lg:col-span-4 label-sm-editorial">Origin & Reference</div>
          <div className="hidden lg:block lg:col-span-2 label-sm-editorial">Exchange Valuation</div>
          <div className="hidden sm:block sm:col-span-3 lg:col-span-2 label-sm-editorial">Ledger State</div>
          <div className="hidden lg:block lg:col-span-2 label-sm-editorial">Remittance</div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 text-right label-sm-editorial">Purge</div>
        </div>

        <div className="space-y-3">
          {paymentList.map((payment) => {
            const total = parseFloat(payment.orderTotal);
            const paidSoFar = parseFloat(payment.orderPaidTotal);
            const remaining = total - paidSoFar;
            const isFullyPaid = remaining <= 0;

            return (
              <div key={payment.id} className="grid grid-cols-12 items-center bg-surface-container-lowest p-6 rounded-[2rem] group hover:bg-surface-container-low transition-all shadow-[0_10px_30px_rgba(11,28,48,0.01)] border border-transparent hover:border-white/50">
                <div className="col-span-6 lg:col-span-4 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary-container text-tertiary flex items-center justify-center transition-transform group-hover:scale-110">
                    <Wallet size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-black text-on-surface tracking-tight leading-tight">{payment.customerName}</span>
                    <span className="text-[10px] font-mono font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.2em] mt-1">JOURNAL-{payment.orderId}</span>
                  </div>
                </div>

                <div className="hidden lg:flex lg:col-span-2 flex-col">
                  <span className="text-sm font-black text-on-surface-variant opacity-40 uppercase tracking-tighter">Total</span>
                  <span className="text-base font-black text-on-surface tracking-tighter">${total.toFixed(2)}</span>
                </div>

                <div className="hidden sm:flex sm:col-span-3 lg:col-span-2">
                  <span className={`status-badge text-[9px] font-black uppercase tracking-widest px-4 py-1.5 ${
                    isFullyPaid ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-600'
                  }`}>
                    {isFullyPaid ? 'Settled' : `$${remaining.toFixed(2)} Due`}
                  </span>
                </div>

                <div className="hidden lg:flex lg:col-span-2 flex-col">
                  <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1">
                    <ArrowDownRight size={12} strokeWidth={3} />
                    Remittance
                  </span>
                  <span className="text-lg font-black text-primary tracking-tighter">${parseFloat(payment.paymentAmount).toFixed(2)}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">{payment.method} • {payment.paidAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2 flex items-center justify-end">
                  <DeleteButton 
                    id={payment.id} 
                    module="payments" 
                    className="p-4 text-on-surface/20 hover:text-tertiary hover:bg-white rounded-2xl transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {paymentList.length === 0 && (
          <div className="bg-surface-container-low p-20 rounded-[3rem] text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-on-surface-variant/20 shadow-sm">
              <History size={40} />
            </div>
            <div>
              <p className="text-xl font-display font-black text-on-surface tracking-tight">Ledger Silent</p>
              <p className="text-sm font-bold text-on-surface-variant opacity-50 mt-1">No financial remittances have been processed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
