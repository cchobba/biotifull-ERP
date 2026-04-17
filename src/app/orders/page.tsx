import { db } from "@/db";
import { orders, customers } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const [totalCount] = await db.select({ value: count() }).from(orders);
  
  // Join with customers to show names
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <Link
          href="/orders/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Create New Order
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Order ID</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Total</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Paid</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Payment Status</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Order Status</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderList.map((order) => {
              const total = parseFloat(order.totalAmount);
              const paid = parseFloat(order.amountPaid);
              const isFullyPaid = paid >= total;
              
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-mono text-gray-600">ORD-{order.id.toString().padStart(5, '0')}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.customerName || "Walk-in Customer"}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">${paid.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold 
                      ${isFullyPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isFullyPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' || order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'in transit' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'on hold' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.createdAt.toLocaleDateString()}</td>
                </tr>
              );
            })}
            {orderList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No orders found. Create your first order to start tracking sales.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            <Link
              href={`/orders?page=${page - 1}`}
              className={`text-sm text-indigo-600 font-medium ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/orders?page=${page + 1}`}
              className={`text-sm text-indigo-600 font-medium ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
