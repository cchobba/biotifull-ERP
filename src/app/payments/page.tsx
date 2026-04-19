import { db } from "@/db";
import { payments, orders, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { DeleteButton } from "@/components/delete-button";

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
    <div className="max-w-7xl mx-auto space-y-8 text-gray-900">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Payments Ledger</h2>
        <p className="text-gray-400 font-medium">History of all transactions processed through the system.</p>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Customer & Order</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Order Amount</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Total Paid</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Balance</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Pmt Amount</th>
                <th className="px-6 py-5 text-right text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paymentList.map((payment) => {
                const total = parseFloat(payment.orderTotal);
                const paidSoFar = parseFloat(payment.orderPaidTotal);
                const remaining = total - paidSoFar;
                const isFullyPaid = remaining <= 0;

                return (
                  <tr key={payment.id} className="hover:bg-brand-sage/[0.02] transition-colors group">
                    <td className="px-6 py-5 text-xs font-semibold text-gray-400 italic">
                      {payment.paidAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{payment.customerName}</span>
                        <span className="font-mono text-[10px] font-bold text-gray-400">ORD-{payment.orderId.toString().padStart(5, '0')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-600 text-sm">
                      ${total.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-600 text-sm">
                      ${paidSoFar.toFixed(2)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                        isFullyPaid ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {isFullyPaid ? 'Fully Paid' : `$${remaining.toFixed(2)} Left`}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-brand-sage">${parseFloat(payment.paymentAmount).toFixed(2)}</span>
                        <span className="text-[9px] uppercase font-bold text-gray-300">{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DeleteButton 
                        id={payment.id} 
                        module="payments" 
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      />
                    </td>
                  </tr>
                );
              })}
              {paymentList.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-gray-400 font-medium italic">
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
