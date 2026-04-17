import { db } from "@/db";
import { products } from "@/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = formData.get("price") as string;
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string);

    await db.insert(products).values({
      name,
      sku,
      price: price,
      stockQuantity,
      lowStockThreshold,
    });

    redirect("/products");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
      </div>

      <form action={createProduct} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              name="sku"
              type="text"
              required
              placeholder="E.g. BT-001"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
            <input
              name="stockQuantity"
              type="number"
              required
              defaultValue="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
            <input
              name="lowStockThreshold"
              type="number"
              required
              defaultValue="5"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/products"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
