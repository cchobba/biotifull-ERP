import { db } from "@/db";
import { customers } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Mandatory Pagination (PRD Rule 7.2)
  const [totalCount] = await db.select({ value: count() }).from(customers);
  const customerList = await db
    .select()
    .from(customers)
    .orderBy(desc(customers.createdAt))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(totalCount.value / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">CRM: Customers</h2>
        <Link
          href="/customers/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customerList.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 text-gray-600">{customer.email || "-"}</td>
                <td className="px-6 py-4 text-gray-600">{customer.phone || "-"}</td>
                <td className="px-6 py-4 text-gray-600">{customer.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {customerList.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No customers found. Click "Add Customer" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            <Link
              href={`/customers?page=${page - 1}`}
              className={`text-sm text-indigo-600 font-medium ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/customers?page=${page + 1}`}
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
