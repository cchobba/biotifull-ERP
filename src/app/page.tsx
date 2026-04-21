import { db } from "@/db";
import { customers, products, orders, payments } from "@/db/schema";
import { count, sum, sql, and, gt, lt, eq } from "drizzle-orm";
import { Users, Package, ShoppingBag, Sparkles, TrendingUp, DollarSign, ArrowUpRight, Zap, Target, Activity } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Basic Counts
  const [customerCount] = await db.select({ value: count() }).from(customers);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);
  const [revenueResult] = await db.select({ value: sum(payments.amount) }).from(payments);
  const revenue = parseFloat(revenueResult.value || "0");

  // 2. Trend Calculations (Revenue & Orders vs Last 30 Days)
  const stats = await db.execute(sql`
    WITH current_month AS (
      SELECT SUM(amount)::float as rev, COUNT(*)::float as ords
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE p.paid_at > now() - interval '30 days'
    ),
    last_month AS (
      SELECT SUM(amount)::float as rev, COUNT(*)::float as ords
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE p.paid_at BETWEEN now() - interval '60 days' AND now() - interval '30 days'
    )
    SELECT 
      c.rev as cur_rev, l.rev as last_rev,
      c.ords as cur_ords, l.ords as last_ords
    FROM current_month c, last_month l
  `);

  const s = (stats as any).rows[0] || { cur_rev: 0, last_rev: 0, cur_ords: 0, last_ords: 0 };
  const revTrend = s.last_rev > 0 ? ((s.cur_rev - s.last_rev) / s.last_rev * 100).toFixed(1) : "+100";
  const ordTrend = s.last_ords > 0 ? ((s.cur_ords - s.last_ords) / s.last_ords * 100).toFixed(1) : "+100";

  // 3. Tactical Alerts
  const lowStockCount = await db
    .select({ value: count() })
    .from(products)
    .where(sql`${products.stockQuantity} <= ${products.lowStockThreshold}`);

  const pendingPaymentsCount = await db
    .select({ value: count() })
    .from(orders)
    .where(sql`${orders.totalAmount} > ${orders.amountPaid}`);

  // 4. Chart Data (Real 6 Months)
  let chartData: { name: string; sales: number }[] = [];
  try {
    const monthlySales = await db.execute(sql`
      SELECT 
        to_char(date_trunc('month', paid_at), 'Mon') as month,
        SUM(amount)::float as sales,
        date_trunc('month', paid_at) as sort_month
      FROM payments
      GROUP BY date_trunc('month', paid_at)
      ORDER BY sort_month ASC
      LIMIT 6
    `);
    chartData = (monthlySales as any).rows.map((row: any) => ({
      name: row.month,
      sales: row.sales || 0
    }));
  } catch (err) {
    console.error("Dashboard chart query failed:", err);
  }

  // 5. Growth Target (Example: Target 50 customers)
  const growthTarget = 50;
  const growthProgress = Math.min(Math.round((customerCount.value / growthTarget) * 100), 100);

  return (
    <div className="max-w-[1400px] mx-auto space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
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
      
      {/* High-Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <KPICard 
            title="Accumulated Revenue" 
            value={`$${revenue.toLocaleString()}`} 
            icon={<DollarSign size={24} />}
            trend={`${parseFloat(revTrend) >= 0 ? '+' : ''}${revTrend}% growth`}
            color="primary"
          />
          <KPICard 
            title="Order Velocity" 
            value={orderCount.value} 
            icon={<Activity size={24} />}
            trend={`${parseFloat(ordTrend) >= 0 ? '+' : ''}${ordTrend}% frequency`}
            color="secondary"
          />
        </div>
        <div className="bg-surface-container-low p-10 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group border border-white/50">
          <div className="relative z-10">
            <p className="label-sm-editorial opacity-50 mb-2">Ambassador Growth</p>
            <p className="text-4xl font-display font-black text-on-surface">{growthProgress}<span className="text-xl opacity-40">%</span></p>
            <p className="text-sm font-bold text-on-surface-variant mt-4 leading-relaxed">
              {customerCount.value} ambassadors recruited toward your {growthTarget} specimen goal.
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-tertiary rounded-full shadow-[0_0_15px_rgba(181,10,83,0.3)] transition-all duration-1000"
                style={{ width: `${growthProgress}%` }}
              ></div>
            </div>
          </div>
          <Target className="absolute -bottom-6 -right-6 w-32 h-32 text-tertiary opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
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

        {/* Tactical Actions */}
        <div className="space-y-8">
          <h3 className="label-sm-editorial opacity-40 px-2">Tactical Journal</h3>
          <div className="space-y-6">
            <QuickAction 
              title="Stock Audit" 
              desc={`${lowStockCount[0].value} Specimen below threshold.`}
              link="/products"
              color="secondary"
              active={lowStockCount[0].value > 0}
            />
            <QuickAction 
              title="Pending Dues" 
              desc={`${pendingPaymentsCount[0].value} Journals await reconciliation.`}
              link="/payments"
              color="tertiary"
              active={pendingPaymentsCount[0].value > 0}
            />
            <div className="bg-primary p-8 rounded-[2.5rem] text-on-primary relative overflow-hidden group shadow-2xl shadow-primary/20">
              <h4 className="text-xl font-display font-bold relative z-10">Generate Audit</h4>
              <p className="text-sm opacity-80 mt-2 relative z-10 leading-relaxed font-medium">
                Produce a high-fidelity CSV ledger for your records.
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

function QuickAction({ title, desc, link, color, active }: { title: string, desc: string, link: string, color: 'secondary' | 'tertiary', active: boolean }) {
  const colorMap = {
    secondary: 'text-secondary',
    tertiary: 'text-tertiary'
  };

  return (
    <Link href={link} className="block group">
      <div className="bg-surface-container-low p-8 rounded-[2rem] border border-white/50 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
        <div className="flex justify-between items-start">
          <h4 className="font-display font-extrabold text-on-surface group-hover:text-primary transition-colors">{title}</h4>
          {active && <div className={`w-2 h-2 rounded-full bg-${color === 'tertiary' ? 'tertiary' : 'secondary'} animate-pulse`}></div>}
        </div>
        <p className="text-sm font-medium text-on-surface-variant mt-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{desc}</p>
        <div className={`mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${colorMap[color]}`}>
          Execute Action <ArrowUpRight size={12} strokeWidth={3} />
        </div>
      </div>
    </Link>
  );
}

function FlowerPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M100 0C100 0 110 50 150 50C190 50 200 0 200 0C200 0 150 10 150 50C150 90 200 100 200 100C200 100 190 110 150 150C110 190 100 200 100 200C100 200 90 150 50 150C10 150 0 200 0 200C0 200 50 190 50 150C50 110 0 100 0 100C0 100 10 90 50 50C90 10 100 0 100 0Z" />
    </svg>
  );
}
