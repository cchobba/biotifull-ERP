import { db } from "@/db";
import { products } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory: Products</h2>
        <Link
          href="/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">SKU</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productList.map((product) => {
              const isLowStock = product.stockQuantity <= product.lowStockThreshold;
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-mono text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">${product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`${isLowStock ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                        {product.stockQuantity}
                      </span>
                      {isLowStock && (
                        <AlertTriangle size={16} className="ml-2 text-red-500" title="Low Stock Alert" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {productList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products found. Click "Add Product" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            <Link
              href={`/products?page=${page - 1}`}
              className={`text-sm text-indigo-600 font-medium ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/products?page=${page + 1}`}
              className={`text-sm text-indigo-600 font-medium ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
