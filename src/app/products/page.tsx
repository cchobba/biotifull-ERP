import { db } from "@/db";
import { products } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, AlertTriangle, PackageSearch, Tag } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const [totalCount] = await db.select({ value: count() }).from(products);
  const productList = await db
    .select()
    .from(products)
    .orderBy(desc(products.id))
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(totalCount.value / limit);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Inventory</h2>
          <p className="text-gray-400 font-medium">Manage your collection of natural beauty products.</p>
        </div>
        <Link
          href="/products/new"
          className="btn-primary"
        >
          <Plus size={18} className="mr-2" />
          Add New Product
        </Link>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Product Details</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Stock Level</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold text-brand-sage-dark uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productList.map((product) => {
                const isLowStock = product.stockQuantity <= product.lowStockThreshold;
                return (
                  <tr key={product.id} className="hover:bg-brand-sage/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-sage-light flex items-center justify-center text-brand-sage transition-transform group-hover:scale-105">
                          <Tag size={20} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 tracking-tight">{product.name}</span>
                          <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-widest">{product.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-extrabold text-brand-terracotta">${product.price}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${isLowStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-gray-700'}`}>
                          {product.stockQuantity} units
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight bg-red-50 px-2 py-0.5 rounded-md">Low Stock</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`status-badge ${product.isActive ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                        {product.isActive ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-xs font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                    </td>
                  </tr>
                );
              })}
              {productList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <PackageSearch size={40} />
                      </div>
                      <p className="text-gray-400 font-medium italic">No products in your catalog yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-50 flex justify-between items-center">
            <Link
              href={`/products?page=${page - 1}`}
              className={`text-sm font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest transition-colors ${page === 1 ? 'pointer-events-none opacity-30' : ''}`}
            >
              Previous
            </Link>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/products?page=${page + 1}`}
              className={`text-sm font-bold text-brand-sage hover:text-brand-sage-dark uppercase tracking-widest transition-colors ${page >= totalPages ? 'pointer-events-none opacity-30' : ''}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
