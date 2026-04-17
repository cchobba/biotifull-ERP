import { db } from "@/db";
import { customers } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, UserPlus, Search, Users, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";

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
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">CRM</h2>
          <p className="text-sm md:text-base text-gray-400 font-medium">Manage your community of Bio-tiful customers.</p>
        </div>
        <Link
          href="/customers/new"
          className="btn-primary w-full sm:w-auto"
        >
          <UserPlus size={18} className="mr-2" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-2xl md:rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] overflow-hidden">
        <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-50 flex items-center bg-white/50">
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
                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Profile</th>
                <th className="hidden sm:table-cell px-4 md:px-8 py-4 md:py-5 text-left text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Contact</th>
                <th className="hidden lg:table-cell px-4 md:px-8 py-4 md:py-5 text-left text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Joined</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-right text-[10px] md:text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customerList.map((customer) => (
                <tr key={customer.id} className="hover:bg-brand-sage/[0.02] transition-colors group">
                  <td className="px-4 md:px-8 py-4 md:py-5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-terracotta font-bold text-xs md:text-sm shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 tracking-tight text-sm md:text-base">{customer.name}</span>
                        <span className="sm:hidden text-xs text-gray-400 font-medium">{customer.email || "No email"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 md:px-8 py-4 md:py-5">
                    <div className="flex flex-col gap-0.5 md:gap-1">
                      <span className="text-xs md:text-sm font-semibold text-gray-600 truncate max-w-[150px]">{customer.email || "No email"}</span>
                      <span className="text-[10px] md:text-xs text-gray-400 font-medium">{customer.phone || "-"}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-4 md:px-8 py-4 md:py-5">
                    <span className="text-xs md:text-sm font-semibold text-gray-500 italic">{customer.createdAt.toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <Link 
                        href={`/customers/${customer.id}/edit`}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-brand-sage hover:bg-brand-sage/5 rounded-lg transition-all"
                        title="Edit Customer"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <DeleteButton 
                        id={customer.id} 
                        module="customers" 
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {customerList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 md:px-8 py-12 md:py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <Users size={32} />
                      </div>
                      <p className="text-sm text-gray-400 font-medium">No customers yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-gray-50/50 px-4 md:px-8 py-4 md:py-6 border-t border-gray-50 flex justify-between items-center">
            <Link
              href={`/customers?page=${page - 1}`}
              className={`text-xs md:text-sm font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest transition-colors ${page === 1 ? 'pointer-events-none opacity-30' : ''}`}
            >
              Prev
            </Link>
            <span className="text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-gray-100 shadow-sm">
              {page} / {totalPages}
            </span>
            <Link
              href={`/customers?page=${page + 1}`}
              className={`text-xs md:text-sm font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest transition-colors ${page >= totalPages ? 'pointer-events-none opacity-30' : ''}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
