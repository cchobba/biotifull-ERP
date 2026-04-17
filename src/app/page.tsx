import { db } from "@/db";
import { customers, products, orders } from "@/db/schema";
import { count } from "drizzle-orm";

export default async function DashboardPage() {
  // Parallel data fetching with RSC
  const [customerCount] = await db.select({ value: count() }).from(customers);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard title="Total Customers" value={customerCount.value} />
        <StatCard title="Active Products" value={productCount.value} />
        <StatCard title="Total Orders" value={orderCount.value} />
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Welcome to Bio-tiful ERP</h3>
        <p className="text-gray-600">
          This system is optimized for Vercel Hobby tier and Neon Serverless. 
          Use the sidebar to manage your CRM, Inventory, and Orders.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="mt-2 text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}
