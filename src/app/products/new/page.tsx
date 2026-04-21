"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Link as LinkIcon, X, CheckCircle2 } from "lucide-react";
import { createProductAction } from "@/app/products/actions";

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Image handling state
  const [imageType, setImageType] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (response.ok) {
        const blob = await response.json();
        setImageUrl(blob.url);
        setPreviewUrl(blob.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    // Explicitly set the final image URL we got from upload or link
    formData.set("imageUrl", imageUrl);

    try {
      const result = await createProductAction(formData);
      if (result.success) {
        router.push("/products");
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-4 px-2">
        <Link
          href="/products"
          className="p-2 rounded-xl hover:bg-white/50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h2 className="text-2xl font-display font-black text-on-surface">Archive New Specimen</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(11,28,48,0.03)] space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Visual Record - Image Selection */}
          <div className="space-y-6 md:col-span-2">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">01 / Visual Identity Selection</label>
            
            <div className="flex gap-4 mb-6">
              <button 
                type="button" 
                onClick={() => setImageType("url")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${imageType === 'url' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container-low text-on-surface/40 hover:bg-surface-container-high'}`}
              >
                <LinkIcon size={14} strokeWidth={3} /> Link Web Record
              </button>
              <button 
                type="button" 
                onClick={() => setImageType("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${imageType === 'upload' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface/40 hover:bg-surface-container-high'}`}
              >
                <Upload size={14} strokeWidth={3} /> Upload Local Data
              </button>
            </div>

            <div className="relative group min-h-[200px] bg-surface-container-low rounded-[2rem] border-2 border-dashed border-white/50 flex flex-col items-center justify-center p-8 transition-all hover:bg-surface-container-highest/20 overflow-hidden">
              {previewUrl ? (
                <>
                  <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Preview" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-xl mb-4">
                      <CheckCircle2 size={32} strokeWidth={3} />
                    </div>
                    <p className="text-sm font-black text-on-surface">Record Linked Successfully</p>
                    <button 
                      type="button" 
                      onClick={() => { setPreviewUrl(""); setImageUrl(""); }}
                      className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-tertiary hover:underline"
                    >
                      Purge and Replace
                    </button>
                  </div>
                </>
              ) : imageType === "url" ? (
                <div className="w-full space-y-4 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon size={14} className="text-secondary" />
                    <span className="text-[10px] font-black uppercase text-secondary tracking-widest">External URL Source</span>
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo..."
                    className="input-field bg-white/80"
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      // Basic preview debouncing could be added here
                      if (e.target.value.match(/\.(jpeg|jpg|gif|png|webp|avif)$/)) {
                        setPreviewUrl(e.target.value);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-xl mb-6 cursor-pointer hover:scale-110 transition-transform" onClick={() => fileInputRef.current?.click()}>
                    {uploading ? <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : <Upload size={32} strokeWidth={3} />}
                  </div>
                  <p className="text-sm font-bold text-on-surface opacity-60">
                    {uploading ? "Extracting Visual Data..." : "Drag and drop or click to upload local specimen photo"}
                  </p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">02 / Identity</label>
            <input
              name="name"
              type="text"
              required
              placeholder="E.g. Botanical Serum No. 1"
              className="input-field font-black text-xl"
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
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">04 / Asset Unit</label>
            <select
              name="unit"
              required
              className="input-field font-bold text-sm"
            >
              <option value="unit">Per Unit (Piece)</option>
              <option value="litre">Per Litre (L)</option>
              <option value="ml">Per Millilitre (ml)</option>
              <option value="kg">Per Kilogram (kg)</option>
              <option value="g">Per Gram (g)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">05 / Unit Valuation (TND)</label>
            <div className="relative">
              <input
                name="price"
                type="number"
                step="0.001"
                required
                placeholder="0.000"
                className="input-field font-black text-primary text-xl pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary/30 uppercase tracking-widest">TND</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">06 / Initial Reserves</label>
            <input
              name="stockQuantity"
              type="number"
              defaultValue="0"
              className="input-field font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">07 / Critical Threshold</label>
            <input
              name="lowStockThreshold"
              type="number"
              defaultValue="5"
              className="input-field font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-10 border-t border-surface-container-high">
          <Link href="/products" className="btn-secondary">
            Abort
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-primary disabled:opacity-30 disabled:grayscale"
          >
            <Save size={18} className="mr-3" />
            {loading ? "Archiving..." : "Finalize Specimen Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
