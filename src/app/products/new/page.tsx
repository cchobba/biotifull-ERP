import { db } from "@/db";
import { products } from "@/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    try {
      const name = formData.get("name") as string;
      const sku = formData.get("sku") as string;
      const imageUrl = formData.get("imageUrl") as string;
      const price = formData.get("price") as string;
      const stockQuantity = parseInt(formData.get("stockQuantity") as string || "0");
      const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string || "5");

      console.log("Attempting to create product:", { name, sku, price });

      await db.insert(products).values({
        name,
        sku,
        imageUrl: imageUrl || null,
        price,
        stockQuantity: isNaN(stockQuantity) ? 0 : stockQuantity,
        lowStockThreshold: isNaN(lowStockThreshold) ? 5 : lowStockThreshold,
        isActive: true,
      });

      console.log("Product created successfully!");
    } catch (error: any) {
      console.error("CRITICAL: Failed to create product:", error);
      throw new Error(`Failed to create product: ${error.message}`);
    }

    redirect("/products");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="flex items-center gap-4 px-2">
        <Link
          href="/products"
          className="p-2 rounded-xl hover:bg-white/50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h2 className="text-2xl font-display font-black text-on-surface">Archive New Specimen</h2>
      </div>

      <form action={createProduct} className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(11,28,48,0.03)] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">01 / Identity</label>
            <input
              name="name"
              type="text"
              required
              placeholder="E.g. Botanical Serum No. 1"
              className="input-field font-bold"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">02 / Visual Record (URL)</label>
            <input
              name="imageUrl"
              type="url"
              placeholder="https://images.unsplash.com/photo..."
              className="input-field font-bold text-xs"
            />
          </div>
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">03 / Codification (SKU)</label>
            <input
              name="sku"
              type="text"
              required
              placeholder="BT-001"
              className="input-field font-mono font-bold"
            />
          </div>
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">04 / Valuation ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="input-field font-black text-primary"
            />
          </div>
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">05 / Initial Reserves</label>
            <input
              name="stockQuantity"
              type="number"
              defaultValue="0"
              className="input-field font-bold"
            />
          </div>
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">06 / Critical Threshold</label>
            <input
              name="lowStockThreshold"
              type="number"
              defaultValue="5"
              className="input-field font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-surface-container-high">
          <Link
            href="/products"
            className="btn-secondary"
          >
            Abort
          </Link>
          <button
            type="submit"
            className="btn-primary"
          >
            <Save size={18} className="mr-3" />
            Finalize Entry
          </button>
        </div>
      </form>
    </div>
  );
}
