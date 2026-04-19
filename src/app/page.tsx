import { db } from "@/db";
import { customers, products, orders, payments } from "@/db/schema";
import { count, sum, sql } from "drizzle-orm";
import { Users, Package, ShoppingBag, Sparkles, TrendingUp, DollarSign, ArrowUpRight, Zap, Target, Activity } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import Link from "next/link";

export default async function DashboardPage() {
  const [customerCount] = await db.select({ value: count() }).from(customers);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);
  const [revenueResult] = await db.select({ value: sum(payments.amount) }).from(payments);
  
  const revenue = parseFloat(revenueResult.value || "0");

  let chartData: { name: string; sales: number }[] = [];
  try {
    const monthlySales = await db.execute(sql`
      SELECT 
        to_char(date_trunc('month', paid_at), 'Mon') as month,
        SUM(amount)::float as sales,
        date_trunc('month', paid_at) as sort_month
      FROM payments
      WHERE paid_at > now() - interval '6 months'
      GROUP BY date_trunc('month', paid_at)
      ORDER BY sort_month ASC
    `);

    chartData = (monthlySales as any).rows.map((row: any) => ({
      name: row.month,
      sales: row.sales || 0
    }));
  } catch (err) {
    console.error("Dashboard chart query failed:", err);
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-tertiary rounded-full"></span>
            <span className="label-sm-editorial text-tertiary">Real-time Intelligence</span>
          </div>
          <h2 className="text-5xl font-display font-black text-on-surface tracking-tight leading-[1.1]">
            The <span className="text-primary italic">Luminous</span> <br /> Ledger Overview
          </h2>
        </div>
        <Link href="/orders/new" className="btn-primary">
          <Zap size={18} className="mr-3 fill-current" />
          Initialize New Transaction
        </Link>
      </div>
      
      {/* High-Impact KPIs - Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <KPICard 
            title="Accumulated Revenue" 
            value={`$${revenue.toLocaleString()}`} 
            icon={<DollarSign size={24} />}
            trend="+12.5% vs last month"
            color="primary"
          />
          <KPICard 
            title="Order Velocity" 
            value={orderCount.value} 
            icon={<Activity size={24} />}
            trend="+5.2% frequency"
            color="secondary"
          />
        </div>
        <div className="bg-surface-container-low p-10 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group border border-white/50">
          <div className="relative z-10">
            <p className="label-sm-editorial opacity-50 mb-2">Growth Target</p>
            <p className="text-4xl font-display font-black text-on-surface">84<span className="text-xl opacity-40">%</span></p>
            <p className="text-sm font-bold text-on-surface-variant mt-4 leading-relaxed">
              You are approaching your quarterly milestone for new customer acquisitions.
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-[84%] rounded-full shadow-[0_0_15px_rgba(181,10,83,0.3)]"></div>
            </div>
          </div>
          <Target className="absolute -bottom-6 -right-6 w-32 h-32 text-tertiary opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Sales Chart - Intentional Asymmetry */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-end justify-between px-2">
            <h3 className="text-2xl font-display font-black text-on-surface tracking-tight">Performance Stream</h3>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp size={16} strokeWidth={3} />
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(11,28,48,0.03)] border border-surface-container-low">
            <SalesChart data={chartData} />
          </div>
        </div>

        {/* Tactical Actions - Tonal Transitions */}
        <div className="space-y-8">
          <h3 className="label-sm-editorial opacity-40 px-2">Tactical Journal</h3>
          <div className="space-y-6">
            <QuickAction 
              title="Stock Audit" 
              desc="4 Botanical Serums below threshold."
              link="/products"
              color="secondary"
            />
            <QuickAction 
              title="Pending Dues" 
              desc="12 Transactions await reconciliation."
              link="/payments"
              color="tertiary"
            />
            <div className="bg-primary p-8 rounded-[2.5rem] text-on-primary relative overflow-hidden group shadow-2xl shadow-primary/20">
              <h4 className="text-xl font-display font-bold relative z-10">Generate Audit</h4>
              <p className="text-sm opacity-80 mt-2 relative z-10 leading-relaxed font-medium">
                Produce a high-fidelity CSV ledger for your botanical records.
              </p>
              <button className="mt-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] relative z-10 bg-white/20 px-6 py-3 rounded-xl backdrop-blur-md hover:bg-white/30 transition-all">
                Export Data <ArrowUpRight size={14} strokeWidth={3} />
              </button>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, color }: { title: string, value: string | number, icon: React.ReactNode, trend: string, color: 'primary' | 'secondary' }) {
  const colorMap = {
    primary: 'bg-primary text-on-primary shadow-primary/20',
    secondary: 'bg-secondary text-on-secondary shadow-secondary/20'
  };

  return (
    <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-surface-container-low hover:border-primary/20 transition-all group shadow-[0_20px_60px_rgba(11,28,48,0.02)]">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="label-sm-editorial opacity-40 mb-2">{title}</p>
      <div className="display-md text-on-surface mb-2">{value}</div>
      <p className="text-xs font-black text-primary uppercase tracking-widest">{trend}</p>
    </div>
  );
}

function QuickAction({ title, desc, link, color }: { title: string, desc: string, link: string, color: 'secondary' | 'tertiary' }) {
  const colorMap = {
    secondary: 'text-secondary',
    tertiary: 'text-tertiary'
  };

  return (
    <Link href={link} className="block group">
      <div className="bg-surface-container-low p-8 rounded-[2rem] border border-white/50 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
        <h4 className="font-display font-extrabold text-on-surface group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm font-medium text-on-surface-variant mt-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{desc}</p>
        <div className={`mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${colorMap[color]}`}>
          Execute Action <ArrowUpRight size={12} strokeWidth={3} />
        </div>
      </div>
    </Link>
  );
}
