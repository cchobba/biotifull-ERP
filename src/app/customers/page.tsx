import { db } from "@/db";
import { customers } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { UserPlus, Search, Users, Edit2, ChevronRight, User } from "lucide-react";
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
    <div className="max-w-[1400px] mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-secondary rounded-full"></span>
            <span className="label-sm-editorial text-secondary">The Human Connection</span>
          </div>
          <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">
            Community <span className="text-secondary italic">Ambassadors</span>
          </h2>
          <p className="text-sm font-bold text-on-surface-variant opacity-60">Architecting your botanical network.</p>
        </div>
        <Link href="/customers/new" className="btn-primary">
          <UserPlus size={18} className="mr-3" />
          Enlist New Ambassador
        </Link>
      </div>

      {/* Search & Filter - Floating Layer */}
      <div className="bg-surface-container-low p-6 rounded-[2rem] border border-white/50 flex items-center gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface opacity-20" size={18} />
          <input 
            type="text" 
            placeholder="Search the community..." 
            className="w-full pl-12 pr-6 py-3.5 bg-surface-container-lowest border-none rounded-2xl text-sm font-bold placeholder:opacity-30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
          />
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="px-5 py-3 bg-white text-secondary rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-secondary/5 transition-all">All Records</div>
          <div className="px-5 py-3 text-on-surface/40 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-secondary/5 transition-all">VIP Collection</div>
        </div>
      </div>

      {/* Luminous Table - No borders, just background shifts */}
      <div className="space-y-4 px-2">
        <div className="grid grid-cols-12 px-8 py-4 opacity-30">
          <div className="col-span-6 lg:col-span-5 label-sm-editorial">Identity & Origin</div>
          <div className="hidden lg:block lg:col-span-3 label-sm-editorial">Communication Channels</div>
          <div className="hidden sm:block sm:col-span-3 lg:col-span-2 label-sm-editorial">Entry Date</div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 text-right label-sm-editorial">Actions</div>
        </div>

        <div className="space-y-3">
          {customerList.map((customer) => (
            <div key={customer.id} className="grid grid-cols-12 items-center bg-surface-container-lowest p-6 rounded-[2rem] group hover:bg-surface-container-low transition-all shadow-[0_10px_30px_rgba(11,28,48,0.01)] hover:shadow-xl hover:shadow-secondary/5 border border-transparent hover:border-white/50">
              <div className="col-span-6 lg:col-span-5 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center font-display font-black text-lg group-hover:scale-110 transition-transform">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-on-surface tracking-tight leading-tight">{customer.name}</span>
                  <span className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mt-1">Ambassador #{customer.id}</span>
                </div>
              </div>

              <div className="hidden lg:flex lg:col-span-3 flex-col gap-1">
                <span className="text-sm font-black text-on-surface opacity-80">{customer.email || "—"}</span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{customer.phone || "No direct line"}</span>
              </div>

              <div className="hidden sm:block sm:col-span-3 lg:col-span-2">
                <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  {customer.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2 flex items-center justify-end gap-2">
                <Link 
                  href={`/customers/${customer.id}/edit`}
                  className="p-3 text-secondary hover:bg-white rounded-xl transition-all"
                >
                  <Edit2 size={16} strokeWidth={3} />
                </Link>
                <DeleteButton 
                  id={customer.id} 
                  module="customers" 
                  className="p-3 text-tertiary hover:bg-white rounded-xl transition-all"
                />
                <div className="p-3 text-on-surface/20 group-hover:text-primary transition-all">
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {customerList.length === 0 && (
          <div className="bg-surface-container-low p-20 rounded-[3rem] text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-on-surface-variant/20 shadow-sm">
              <User size={40} />
            </div>
            <div>
              <p className="text-xl font-display font-black text-on-surface tracking-tight">Community Silence</p>
              <p className="text-sm font-bold text-on-surface-variant opacity-50 mt-1">Your ledger is currently devoid of botanical ambassadors.</p>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pt-10 flex justify-between items-center px-4">
            <Link
              href={`/customers?page=${page - 1}`}
              className={`text-xs font-black uppercase tracking-[0.2em] text-on-surface transition-all ${page === 1 ? 'opacity-10 pointer-events-none' : 'opacity-40 hover:opacity-100 hover:text-primary'}`}
            >
              ← Previous Epoch
            </Link>
            <div className="label-sm-editorial opacity-20 px-8 py-3 bg-surface-container-low rounded-full">
              Volume {page} of {totalPages}
            </div>
            <Link
              href={`/customers?page=${page + 1}`}
              className={`text-xs font-black uppercase tracking-[0.2em] text-on-surface transition-all ${page >= totalPages ? 'opacity-10 pointer-events-none' : 'opacity-40 hover:opacity-100 hover:text-primary'}`}
            >
              Next Epoch →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
