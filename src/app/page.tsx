import { db } from "@/db";
import { customers, products, orders } from "@/db/schema";
import { count } from "drizzle-orm";
import { Users, Package, ShoppingBag, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const [customerCount] = await db.select({ value: count() }).from(customers);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
          <Sparkles className="text-brand-rose" size={28} />
          Welcome Back
        </h2>
        <p className="text-gray-400 font-medium">Here's what's happening with Bio-tiful today.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <StatCard 
          title="Total Customers" 
          value={customerCount.value} 
          icon={<Users className="text-brand-sage" size={24} />}
          bg="bg-brand-sage/10"
        />
        <StatCard 
          title="Active Products" 
          value={productCount.value} 
          icon={<Package className="text-brand-terracotta" size={24} />}
          bg="bg-brand-terracotta/10"
        />
        <StatCard 
          title="Total Orders" 
          value={orderCount.value} 
          icon={<ShoppingBag className="text-brand-rose" size={24} />}
          bg="bg-brand-rose/10"
        />
      </div>

      <div className="bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/60 shadow-[0_20px_50px_rgba(141,163,153,0.05)] relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Store Performance</h3>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            Your natural cosmetics business is growing. Keep an eye on your inventory levels and customer engagement to ensure smooth operations. 
            All your data is securely stored and optimized for your growth.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="px-6 py-2.5 bg-brand-sage text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-sage/20 cursor-pointer hover:bg-brand-sage-dark transition-all">
              View Reports
            </div>
            <div className="px-6 py-2.5 bg-white text-brand-sage-dark rounded-xl text-sm font-bold border border-brand-sage/10 cursor-pointer hover:bg-brand-sage-light transition-all">
              Manage Orders
            </div>
          </div>
        </div>
        
        {/* Decorative element */}
        <FlowerPattern className="absolute top-0 right-0 h-full text-brand-sage/5 -mr-10 group-hover:scale-110 transition-transform duration-1000" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }: { title: string; value: number; icon: React.ReactNode; bg: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-brand-sage/5 shadow-[0_10px_30px_rgba(141,163,153,0.03)] hover:shadow-[0_15px_40px_rgba(141,163,153,0.06)] transition-all flex items-start gap-6 group">
      <div className={`${bg} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="mt-1 text-3xl font-extrabold text-gray-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function FlowerPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} width="200" height="200" fill="currentColor">
      <path d="M100 0C100 0 110 50 150 50C190 50 200 0 200 0C200 0 150 10 150 50C150 90 200 100 200 100C200 100 190 110 150 150C110 190 100 200 100 200C100 200 90 150 50 150C10 150 0 200 0 200C0 200 50 190 50 150C50 110 0 100 0 100C0 100 10 90 50 50C90 10 100 0 100 0Z" />
    </svg>
  );
}
