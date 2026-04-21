"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Link as LinkIcon, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { createProductAction } from "@/app/products/actions";

const UNIT_TYPES = [
  { id: "unit", label: "Piece (Unit)" },
  { id: "kg", label: "Kilogram (kg)" },
  { id: "g", label: "Gram (g)" },
  { id: "litre", label: "Litre (L)" },
  { id: "ml", label: "Millilitre (ml)" },
  { id: "meter", label: "Meter (m)" },
  { id: "cm", label: "Centimeter (cm)" },
  { id: "pack", label: "Pack" },
  { id: "box", label: "Box" },
];

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Image handling state
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Identity & Visual Record */}
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">01 / Product Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="E.g. Botanical Serum No. 1"
                className="input-field font-black text-2xl"
              />
            </div>

            <div className="space-y-4">
              <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">02 / Visual Representation</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-stretch">
                {/* Nested URL input and Upload button */}
                <div className="relative flex-1 w-full">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/20" size={18} />
                  <input
                    type="url"
                    placeholder="Paste image URL here..."
                    className="input-field pl-12 pr-12"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i)) {
                        setPreviewUrl(e.target.value);
                      }
                    }}
                  />
                  {imageUrl && (
                    <button 
                      type="button" 
                      onClick={() => { setImageUrl(""); setPreviewUrl(""); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:scale-110 transition-transform"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  )}
                </div>
                
                <div className="flex shrink-0 gap-2 w-full sm:w-auto">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <button 
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary whitespace-nowrap"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Upload size={18} className="mr-2" />
                    )}
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Preview Layer */}
              {previewUrl && (
                <div className="mt-4 relative w-full h-40 bg-surface-container-low rounded-2xl overflow-hidden border border-white/50 group">
                  <img src={previewUrl} className="w-full h-full object-contain p-2" alt="Preview" />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                    <CheckCircle2 className="text-white" size={32} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Logistics */}
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
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">04 / Valuation & Units</label>
            <div className="flex gap-4">
              {/* Nested Price and Unit Dropdown */}
              <div className="relative flex-[1.5]">
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
              <div className="flex-1 min-w-[140px]">
                <select
                  name="unit"
                  required
                  className="input-field font-bold text-sm bg-surface-container-highest/50 h-full"
                >
                  {UNIT_TYPES.map(unit => (
                    <option key={unit.id} value={unit.id}>/ {unit.id}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">05 / Initial Quantity</label>
            <input
              name="stockQuantity"
              type="number"
              required
              defaultValue="0"
              className="input-field font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">06 / Critical Reserve (Threshold)</label>
            <input
              name="lowStockThreshold"
              type="number"
              required
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
