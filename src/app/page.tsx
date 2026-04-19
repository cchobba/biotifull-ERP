import { db } from "@/db";
import { customers, products, orders, payments } from "@/db/schema";
import { count, sum, sql } from "drizzle-orm";
import { Users, Package, ShoppingBag, Sparkles, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import Link from "next/link";

export default async function DashboardPage() {
  const [customerCount] = await db.select({ value: count() }).from(customers);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);
  const [revenueResult] = await db.select({ value: sum(payments.amount) }).from(payments);
  
  const revenue = parseFloat(revenueResult.value || "0");

  // Fetch real data for the last 6 months with fallback
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
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            <Sparkles className="text-brand-rose" size={28} />
            Dashboard
          </h2>
          <p className="text-gray-400 font-medium">Real-time performance metrics for Bio-tiful.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/orders/new" className="btn-primary py-2.5">
            <PlusIcon className="mr-2 h-4 w-4" /> New Order
          </Link>
        </div>
      </div>
      
      {/* Top KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Revenue" 
          value={`$${revenue.toLocaleString()}`} 
          icon={<DollarSign className="text-brand-sage" size={20} />}
          bg="bg-brand-sage/10"
          trend="+12.5%"
        />
        <StatCard 
          title="Total Orders" 
          value={orderCount.value} 
          icon={<ShoppingBag className="text-brand-terracotta" size={20} />}
          bg="bg-brand-terracotta/10"
          trend="+5.2%"
        />
        <StatCard 
          title="Customers" 
          value={customerCount.value} 
          icon={<Users className="text-brand-rose" size={20} />}
          bg="bg-brand-rose/10"
          trend="+8.1%"
        />
        <StatCard 
          title="Products" 
          value={productCount.value} 
          icon={<Package className="text-brand-earth" size={20} />}
          bg="bg-brand-earth/20"
          trend="Stable"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_50px_rgba(141,163,153,0.05)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Sales Analytics</h3>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Last 6 Months</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl">
              <TrendingUp size={20} className="text-brand-sage" />
            </div>
          </div>
          <SalesChart data={chartData} />
        </div>

        {/* Action Cards */}
        <div className="space-y-6">
          <QuickActionCard 
            title="Inventory Check" 
            desc="You have products running low on stock."
            link="/products"
            linkText="Manage Inventory"
            color="brand-terracotta"
          />
          <QuickActionCard 
            title="Unpaid Orders" 
            desc="Track customers with remaining balances."
            link="/payments"
            linkText="View Ledger"
            color="brand-sage"
          />
          <div className="bg-brand-rose/5 p-8 rounded-[2rem] border border-brand-rose/10 relative overflow-hidden group">
            <h3 className="text-lg font-bold text-gray-800 relative z-10">Store Reports</h3>
            <p className="text-sm text-gray-500 mt-2 relative z-10 leading-relaxed">
              Generate detailed CSV exports for your monthly accounting.
            </p>
            <button className="mt-6 flex items-center gap-2 text-xs font-bold text-brand-rose uppercase tracking-widest group-hover:gap-3 transition-all relative z-10">
              Download Report <ArrowUpRight size={14} />
            </button>
            <FlowerPattern className="absolute -bottom-10 -right-10 h-32 w-32 text-brand-rose/5 group-hover:rotate-12 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg, trend }: { title: string; value: string | number; icon: React.ReactNode; bg: string; trend: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-brand-sage/5 shadow-[0_10px_30px_rgba(141,163,153,0.03)] hover:shadow-[0_15px_40px_rgba(141,163,153,0.06)] transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`${bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, desc, link, linkText, color }: { title: string, desc: string, link: string, linkText: string, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-400 mt-2 leading-relaxed">{desc}</p>
      <Link 
        href={link} 
        className={`mt-6 inline-flex items-center gap-2 text-xs font-bold text-${color} uppercase tracking-widest hover:underline decoration-2 underline-offset-4`}
      >
        {linkText} <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function FlowerPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M100 0C100 0 110 50 150 50C190 50 200 0 200 0C200 0 150 10 150 50C150 90 200 100 200 100C200 100 190 110 150 150C110 190 100 200 100 200C100 200 90 150 50 150C10 150 0 200 0 200C0 200 50 190 50 150C50 110 0 100 0 100C0 100 10 90 50 50C90 10 100 0 100 0Z" />
    </svg>
  );
}
