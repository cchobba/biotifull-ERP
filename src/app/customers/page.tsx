import { db } from "@/db";
import { customers } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, UserPlus, Search, Users } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const [totalCount] = await db.select({ value: count() }).from(customers);
  const customerList = await db
    .select()
    .from(customers)
    .orderBy(desc(customers.createdAt))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(totalCount.value / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">CRM</h2>
          <p className="text-gray-400 font-medium">Manage your growing community of Bio-tiful customers.</p>
        </div>
        <Link
          href="/customers/new"
          className="btn-primary"
        >
          <UserPlus size={18} className="mr-2" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center bg-white/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-brand-sage focus:ring-0 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Customer Profile</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Contact Information</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customerList.map((customer) => (
                <tr key={customer.id} className="hover:bg-brand-sage/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-terracotta font-bold text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-800 tracking-tight">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-600">{customer.email || "No email"}</span>
                      <span className="text-xs text-gray-400 font-medium">{customer.phone || "-"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-semibold text-gray-500 italic">{customer.createdAt.toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-xs font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Details</button>
                  </td>
                </tr>
              ))}
              {customerList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <Users size={32} />
                      </div>
                      <p className="text-gray-400 font-medium">No customers yet. Start building your base.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-50 flex justify-between items-center">
            <Link
              href={`/customers?page=${page - 1}`}
              className={`text-sm font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest transition-colors ${page === 1 ? 'pointer-events-none opacity-30' : ''}`}
            >
              Previous
            </Link>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/customers?page=${page + 1}`}
              className={`text-sm font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest transition-colors ${page >= totalPages ? 'pointer-events-none opacity-30' : ''}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
