import { db } from "@/db";
import { providers } from "@/db/schema";
import { NewExpenseForm } from "@/components/new-expense-form";

export default async function NewExpensePage() {
  const providerList = await db
    .select({ id: providers.id, name: providers.name })
    .from(providers);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-2 px-2">
        <div className="flex items-center gap-3">
          <span className="w-12 h-[2px] bg-tertiary rounded-full"></span>
          <span className="label-sm-editorial text-tertiary">Expense Logging</span>
        </div>
        <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">
          Chronicle <span className="text-tertiary italic">Expense</span>
        </h2>
        <p className="text-sm font-bold text-on-surface-variant opacity-60">Ensuring every botanical investment is precisely recorded.</p>
      </div>

      <NewExpenseForm providers={providerList} />
    </div>
  );
}
