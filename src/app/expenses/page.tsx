import { db } from "@/db";
import { expenses, providers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Plus, Wallet, Receipt, ChevronRight, Filter } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";

export default async function ExpensesPage() {
  const expenseList = await db
    .select({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.amount,
      category: expenses.category,
      date: expenses.date,
      reference: expenses.reference,
      providerName: providers.name,
    })
    .from(expenses)
    .leftJoin(providers, eq(expenses.providerId, providers.id))
    .orderBy(desc(expenses.date));

  return (
    <div className="max-w-[1400px] mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-tertiary rounded-full"></span>
            <span className="label-sm-editorial text-tertiary">Operational Overhead</span>
          </div>
          <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">
            The Expense <span className="text-tertiary italic">Archive</span>
          </h2>
          <p className="text-sm font-bold text-on-surface-variant opacity-60">Chronitizing every botanical investment and utility.</p>
        </div>
        <Link href="/expenses/new" className="btn-primary">
          <Plus size={18} className="mr-3" />
          Log New Expense
        </Link>
      </div>

      {/* Tonal Category Summary */}
      <div className="bg-surface-container-low p-6 rounded-[2rem] border border-white/50 flex flex-wrap gap-4">
        <div className="px-5 py-3 bg-white text-on-surface rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">All Spending</div>
        <div className="px-5 py-3 text-on-surface/40 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/50 transition-all cursor-pointer">COGS</div>
        <div className="px-5 py-3 text-on-surface/40 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/50 transition-all cursor-pointer">Marketing</div>
        <div className="px-5 py-3 text-on-surface/40 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/50 transition-all cursor-pointer">Utilities</div>
        <div className="px-5 py-3 text-on-surface/40 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/50 transition-all cursor-pointer ml-auto"><Filter size={14} /></div>
      </div>

      {/* Luminous Table */}
      <div className="space-y-4 px-2">
        <div className="grid grid-cols-12 px-8 py-4 opacity-30">
          <div className="col-span-6 lg:col-span-4 label-sm-editorial">Description & Provider</div>
          <div className="hidden lg:block lg:col-span-2 label-sm-editorial">Category</div>
          <div className="hidden sm:block sm:col-span-3 lg:col-span-2 label-sm-editorial">Valuation</div>
          <div className="hidden lg:block lg:col-span-2 label-sm-editorial">Chronology</div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 text-right label-sm-editorial">Purge</div>
        </div>

        <div className="space-y-3">
          {expenseList.map((expense) => (
            <div key={expense.id} className="grid grid-cols-12 items-center bg-surface-container-lowest p-6 rounded-[2rem] group hover:bg-surface-container-low transition-all shadow-[0_10px_30px_rgba(11,28,48,0.01)] border border-transparent hover:border-white/50">
              <div className="col-span-6 lg:col-span-4 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-tertiary flex items-center justify-center transition-transform group-hover:scale-110">
                  <Receipt size={24} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-on-surface tracking-tight leading-tight">{expense.description}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mt-1">{expense.providerName || "One-time Purchase"}</span>
                </div>
              </div>

              <div className="hidden lg:flex lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-lg">
                  {expense.category}
                </span>
              </div>

              <div className="hidden sm:flex sm:col-span-3 lg:col-span-2">
                <span className="text-lg font-black text-tertiary tracking-tighter">-${parseFloat(expense.amount).toFixed(2)}</span>
              </div>

              <div className="hidden lg:flex lg:col-span-2 items-center gap-2 text-xs font-bold text-on-surface-variant opacity-40">
                {expense.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2 flex items-center justify-end">
                <DeleteButton 
                  id={expense.id} 
                  module="expenses" 
                  className="p-4 text-on-surface/20 hover:text-tertiary hover:bg-white rounded-2xl transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {expenseList.length === 0 && (
          <div className="bg-surface-container-low p-20 rounded-[3rem] text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-on-surface-variant/20 shadow-sm">
              <Wallet size={40} />
            </div>
            <div>
              <p className="text-xl font-display font-black text-on-surface tracking-tight">Ledger Silent</p>
              <p className="text-sm font-bold text-on-surface-variant opacity-50 mt-1">No operational expenses have been chronicled.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
