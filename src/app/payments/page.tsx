import { db } from "@/db";
import { payments, orders, customers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payments Ledger</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Method</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paymentList.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 text-gray-600">{payment.paidAt.toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{payment.customerName}</td>
                <td className="px-6 py-4 text-gray-600">ORD-{payment.orderId.toString().padStart(5, '0')}</td>
                <td className="px-6 py-4 text-gray-600 capitalize">{payment.method}</td>
                <td className="px-6 py-4 font-bold text-green-600">${payment.amount}</td>
              </tr>
            ))}
            {paymentList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No payments recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
