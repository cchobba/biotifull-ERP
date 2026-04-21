import { db } from "@/db";
import { customers, products, orders, payments, expenses } from "@/db/schema";
import { count, sum, sql, desc } from "drizzle-orm";
import { Users, Package, ShoppingBag, Sparkles, TrendingUp, DollarSign, ArrowUpRight, Zap, Target, Activity, BarChart3, PieChart } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Basic Counts & Totals
  const [customerCount] = await db.select({ value: count() }).from(customers);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);
  
  const [revenueResult] = await db.select({ value: sum(payments.amount) }).from(payments);
  const totalRevenue = parseFloat(revenueResult.value || "0");

  const [expenseResult] = await db.select({ value: sum(expenses.amount) }).from(expenses);
  const totalExpense = parseFloat(expenseResult.value || "0");

  const totalProfit = totalRevenue - totalExpense;

  // 2. Current Month Profit
  const currentMonthFinancials = await db.execute(sql`
    WITH monthly_rev AS (
      SELECT COALESCE(SUM(amount), 0)::float as rev
      FROM payments
      WHERE paid_at > date_trunc('month', now())
    ),
    monthly_exp AS (
      SELECT COALESCE(SUM(amount), 0)::float as exp
      FROM expenses
      WHERE date > date_trunc('month', now())
    )
    SELECT rev, exp, (rev - exp) as profit FROM monthly_rev, monthly_exp
  `);
  const curMonth = (currentMonthFinancials as any).rows[0] || { rev: 0, exp: 0, profit: 0 };

  // 3. Multi-Chart Data (Last 6 Months)
  let salesData: any[] = [];
  let expenseData: any[] = [];
  let profitData: any[] = [];

  try {
    const rawData = await db.execute(sql`
      WITH months AS (
        SELECT date_trunc('month', generate_series(now() - interval '5 months', now(), interval '1 month')) as m
      ),
      rev_by_month AS (
        SELECT date_trunc('month', paid_at) as m, SUM(amount)::float as val
        FROM payments GROUP BY 1
      ),
      exp_by_month AS (
        SELECT date_trunc('month', date) as m, SUM(amount)::float as val
        FROM expenses GROUP BY 1
      )
      SELECT 
        to_char(months.m, 'Mon') as month,
        COALESCE(rev.val, 0) as sales,
        COALESCE(exp.val, 0) as expenses,
        (COALESCE(rev.val, 0) - COALESCE(exp.val, 0)) as profit
      FROM months
      LEFT JOIN rev_by_month rev ON months.m = rev.m
      LEFT JOIN exp_by_month exp ON months.m = exp.m
      ORDER BY months.m ASC
    `);

    const rows = (rawData as any).rows;
    salesData = rows.map((r: any) => ({ name: r.month, sales: r.sales }));
    expenseData = rows.map((r: any) => ({ name: r.month, sales: r.expenses }));
    profitData = rows.map((r: any) => ({ name: r.month, sales: r.profit }));
  } catch (err) {
    console.error("Dashboard multi-chart query failed:", err);
  }

  // 4. Growth Target
  const growthTarget = 50;
  const growthProgress = Math.min(Math.round((customerCount.value / growthTarget) * 100), 100);

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-tertiary rounded-full"></span>
            <span className="label-sm-editorial text-tertiary">Financial Intelligence</span>
          </div>
          <h2 className="text-5xl font-display font-black text-on-surface tracking-tight leading-[1.1]">
            Profit <span className="text-primary italic">&</span> <br /> Performance Audit
          </h2>
        </div>
        <Link href="/orders/new" className="btn-primary">
          <Zap size={18} className="mr-3 fill-current" />
          Initialize Transaction
        </Link>
      </div>
      
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard 
          title="Cumulated Profit" 
          value={`$${totalProfit.toLocaleString()}`} 
          icon={<DollarSign size={24} />}
          sub="Lifetime Net"
          color="primary"
        />
        <KPICard 
          title="Profit This Month" 
          value={`$${curMonth.profit.toLocaleString()}`} 
          icon={<TrendingUp size={24} />}
          sub={`${((curMonth.profit / (curMonth.rev || 1)) * 100).toFixed(0)}% Margin`}
          color="secondary"
        />
        <KPICard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={<Activity size={24} />}
          sub="Gross Inflow"
          color="secondary"
        />
        <KPICard 
          title="Total Expenses" 
          value={`$${totalExpense.toLocaleString()}`} 
          icon={<PieChart size={24} />}
          sub="Total Outflow"
          color="tertiary"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sales vs Profit Chart */}
        <div className="space-y-8">
          <h3 className="text-2xl font-display font-black text-on-surface tracking-tight px-2 flex items-center gap-3">
            <BarChart3 className="text-primary" size={24} />
            Revenue Stream
          </h3>
          <div className="bg-surface-container-lowest p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(11,28,48,0.03)] border border-surface-container-low">
            <SalesChart data={salesData} />
          </div>
        </div>

        {/* Expenses Chart */}
        <div className="space-y-8">
          <h3 className="text-2xl font-display font-black text-on-surface tracking-tight px-2 flex items-center gap-3">
            <PieChart className="text-tertiary" size={24} />
            Operational Outflow
          </h3>
          <div className="bg-surface-container-lowest p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(11,28,48,0.03)] border border-surface-container-low">
            <SalesChart data={expenseData} colorType="tertiary" />
          </div>
        </div>

        {/* Net Profit History */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-display font-black text-on-surface tracking-tight px-2 flex items-center gap-3">
            <TrendingUp className="text-secondary" size={24} />
            Monthly Net Profit
          </h3>
          <div className="bg-surface-container-low p-10 rounded-[3rem] border border-white/50">
            <SalesChart data={profitData} colorType="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, sub, color }: { title: string, value: string, icon: React.ReactNode, sub: string, color: 'primary' | 'secondary' | 'tertiary' }) {
  const colorMap = {
    primary: 'bg-primary text-on-primary shadow-primary/20',
    secondary: 'bg-secondary text-on-secondary shadow-secondary/20',
    tertiary: 'bg-tertiary text-on-tertiary shadow-tertiary/20'
  };

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-surface-container-low hover:border-primary/20 transition-all group shadow-[0_20px_60px_rgba(11,28,48,0.02)]">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="label-sm-editorial opacity-40 mb-1">{title}</p>
      <div className="text-3xl font-display font-black text-on-surface mb-1 tracking-tight">{value}</div>
      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{sub}</p>
    </div>
  );
}
