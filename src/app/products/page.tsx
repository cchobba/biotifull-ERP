import { db } from "@/db";
import { products } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, Tag, Edit2, ChevronRight, Package } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let totalCount = { value: 0 };
  let productList: any[] = [];

  try {
    const [countRes] = await db.select({ value: count() }).from(products);
    totalCount = countRes;
    
    productList = await db
      .select()
      .from(products)
      .orderBy(desc(products.id))
      .limit(limit)
      .offset(offset);
  } catch (err) {
    console.error("Products fetch failed:", err);
  }

  const totalPages = Math.ceil(totalCount.value / limit);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-primary rounded-full"></span>
            <span className="label-sm-editorial text-primary">Inventory Intelligence</span>
          </div>
          <h2 className="text-4xl font-display font-black text-on-surface tracking-tight">
            The <span className="text-primary italic">Botanical</span> Collection
          </h2>
          <p className="text-sm font-bold text-on-surface-variant opacity-60">Curating and monitoring your natural reserves.</p>
        </div>
        <Link href="/products/new" className="btn-primary">
          <Plus size={18} className="mr-3" />
          Archive New Specimen
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-2">
        <QuickStat title="Total Skus" value={totalCount.value} color="primary" />
        <QuickStat title="Low Reserves" value={productList.filter(p => (p.stockQuantity || 0) <= (p.lowStockThreshold || 0)).length} color="tertiary" />
        <QuickStat title="Active Assets" value={productList.filter(p => p.isActive).length} color="secondary" />
      </div>

      <div className="space-y-4 px-2">
        <div className="grid grid-cols-12 px-8 py-4 opacity-30">
          <div className="col-span-6 lg:col-span-5 label-sm-editorial">Specimen Details</div>
          <div className="hidden lg:block lg:col-span-2 label-sm-editorial">Valuation</div>
          <div className="hidden sm:block sm:col-span-3 lg:col-span-3 label-sm-editorial">Reserves Level</div>
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 text-right label-sm-editorial">Actions</div>
        </div>

        <div className="space-y-3">
          {productList.map((product) => {
            const isLowStock = product.stockQuantity <= product.lowStockThreshold;
            return (
              <div key={product.id} className="grid grid-cols-12 items-center bg-surface-container-lowest p-6 rounded-[2rem] group hover:bg-surface-container-low transition-all shadow-[0_10px_30px_rgba(11,28,48,0.01)] border border-transparent hover:border-white/50">
                <div className="col-span-6 lg:col-span-5 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center transition-transform group-hover:scale-105 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Tag size={24} strokeWidth={1.5} />
                    )}
                    {!product.isActive && (
                      <div className="absolute inset-0 bg-surface-container-highest/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                        <span className="text-[8px] font-black uppercase tracking-tighter text-on-surface/40">Archived</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-black text-on-surface tracking-tight leading-tight">{product.name}</span>
                    <span className="text-[10px] font-mono font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.2em] mt-1">{product.sku}</span>
                  </div>
                </div>

                <div className="hidden lg:flex lg:col-span-2">
                  <span className="text-lg font-black text-primary tracking-tighter">${parseFloat(product.price).toFixed(2)}</span>
                </div>

                <div className="hidden sm:flex sm:col-span-3 lg:col-span-3 items-center gap-3">
                  <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden max-w-[100px]">
                    <div 
                      className={`h-full rounded-full ${isLowStock ? 'bg-tertiary shadow-[0_0_10px_rgba(181,10,83,0.3)]' : 'bg-primary/40'}`}
                      style={{ width: `${Math.min((product.stockQuantity / (product.lowStockThreshold * 3)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black ${isLowStock ? 'text-tertiary' : 'text-on-surface-variant'}`}>{product.stockQuantity} units</span>
                    {isLowStock && <span className="text-[9px] font-black text-tertiary uppercase tracking-tighter animate-pulse">Critical Reserve</span>}
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2 flex items-center justify-end gap-2">
                  <Link 
                    href={`/products/${product.id}/edit`}
                    className="p-3 text-secondary hover:bg-white rounded-xl transition-all"
                  >
                    <Edit2 size={16} strokeWidth={3} />
                  </Link>
                  <DeleteButton 
                    id={product.id} 
                    module="products" 
                    className="p-3 text-tertiary hover:bg-white rounded-xl transition-all"
                  />
                  <div className="p-3 text-on-surface/20 group-hover:text-primary transition-all">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {productList.length === 0 && (
          <div className="bg-surface-container-low p-20 rounded-[3rem] text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-on-surface-variant/20 shadow-sm">
              <Package size={40} />
            </div>
            <div>
              <p className="text-xl font-display font-black text-on-surface tracking-tight">Empty Collection</p>
              <p className="text-sm font-bold text-on-surface-variant opacity-50 mt-1">Your botanical archives are currently empty.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ title, value, color }: { title: string, value: number | string, color: 'primary' | 'secondary' | 'tertiary' }) {
  const colorMap = {
    primary: 'text-primary bg-primary/5',
    secondary: 'text-secondary bg-secondary/5',
    tertiary: 'text-tertiary bg-tertiary/5'
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border border-white/50 flex flex-col gap-1 transition-all hover:shadow-lg ${colorMap[color]}`}>
      <span className="label-sm-editorial opacity-60">{title}</span>
      <span className="text-3xl font-display font-black tracking-tight">{value}</span>
    </div>
  );
}
