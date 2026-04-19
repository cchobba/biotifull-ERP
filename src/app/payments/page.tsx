import { db } from "@/db";
import { payments, orders, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { DeleteButton } from "@/components/delete-button";

export default async function PaymentsPage() {
  const paymentList = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      method: payments.method,
      paidAt: payments.paidAt,
      orderId: orders.id,
      customerName: customers.name,
    })
    .from(payments)
    .innerJoin(orders, eq(payments.orderId, orders.id))
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(payments.paidAt));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Payments Ledger</h2>
        <p className="text-gray-400 font-medium">History of all transactions processed through the system.</p>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Customer</th>
                <th className="hidden sm:table-cell px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Order ID</th>
                <th className="hidden lg:table-cell px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Method</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paymentList.map((payment) => (
                <tr key={payment.id} className="hover:bg-brand-sage/[0.02] transition-colors group">
                  <td className="px-8 py-5 text-sm font-semibold text-gray-500 italic">
                    {payment.paidAt.toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-gray-800">{payment.customerName}</span>
                  </td>
                  <td className="hidden sm:table-cell px-8 py-5">
                    <span className="font-mono text-xs font-bold text-gray-400">ORD-{payment.orderId.toString().padStart(5, '0')}</span>
                  </td>
                  <td className="hidden lg:table-cell px-8 py-5 capitalize text-sm font-medium text-gray-500">
                    {payment.method}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-green-600">${parseFloat(payment.amount).toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <DeleteButton 
                      id={payment.id} 
                      module="payments" 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    />
                  </td>
                </tr>
              ))}
              {paymentList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-gray-400 font-medium italic">
                    No payments recorded yet.
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
