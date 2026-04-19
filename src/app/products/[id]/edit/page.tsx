import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) {
    notFound();
  }

  async function updateProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const price = formData.get("price") as string;
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string);
    const isActive = formData.get("isActive") === "on";

    await db
      .update(products)
      .set({
        name,
        sku,
        price,
        stockQuantity,
        lowStockThreshold,
        isActive,
      })
      .where(eq(products.id, productId));

    redirect("/products");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="p-2 rounded-xl hover:bg-white/50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
      </div>

      <form action={updateProduct} className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={product.name}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">SKU</label>
            <input
              name="sku"
              type="text"
              required
              defaultValue={product.sku}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={product.price}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Current Stock</label>
            <input
              name="stockQuantity"
              type="number"
              required
              defaultValue={product.stockQuantity}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Low Stock Alert at</label>
            <input
              name="lowStockThreshold"
              type="number"
              required
              defaultValue={product.lowStockThreshold}
              className="input-field"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 py-2">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={product.isActive ?? true}
              className="w-5 h-5 rounded border-gray-300 text-brand-sage focus:ring-brand-sage"
            />
            <label className="text-sm font-bold text-gray-700">Product is available for sale</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/products"
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary"
          >
            <Save size={18} className="mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
