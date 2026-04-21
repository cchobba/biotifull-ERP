"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Store } from "lucide-react";
import Link from "next/link";

type Provider = {
  id: number;
  name: string;
};

export function NewExpenseForm({ providers: initialProviders }: { providers: Provider[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNewProvider, setShowNewProvider] = useState(false);
  const [providers, setProviders] = useState(initialProviders);

  // New Provider State
  const [newProviderName, setNewProviderName] = useState("");

  async function handleAddProvider() {
    if (!newProviderName) return;
    setLoading(true);
    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProviderName }),
      });
      if (response.ok) {
        const provider = await response.json();
        setProviders([...providers, provider]);
        setNewProviderName("");
        setShowNewProvider(false);
      }
    } catch (err) {
      alert("Failed to add provider");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      description: formData.get("description"),
      amount: formData.get("amount"),
      category: formData.get("category"),
      providerId: formData.get("providerId"),
      reference: formData.get("reference"),
      date: formData.get("date"),
    };

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/expenses");
        router.refresh();
      }
    } catch (err) {
      alert("Failed to save expense");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(11,28,48,0.03)] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">01 / Narrative Description</label>
            <input
              name="description"
              type="text"
              required
              placeholder="E.g. Raw Botanical Serum Ingredients"
              className="input-field font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">02 / Provider Source</label>
            <div className="flex gap-2">
              <select
                name="providerId"
                className="input-field font-bold text-sm appearance-none bg-surface-container-highest/50"
              >
                <option value="">One-time Purchase</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewProvider(!showNewProvider)}
                className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
              >
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
            
            {showNewProvider && (
              <div className="p-4 bg-surface-container-low rounded-2xl border border-white/50 space-y-3 animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  placeholder="New Provider Name"
                  value={newProviderName}
                  onChange={(e) => setNewProviderName(e.target.value)}
                  className="w-full px-4 py-2 text-xs font-bold rounded-lg border-none bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddProvider}
                  className="w-full py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20"
                >
                  Confirm Provider
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">03 / Expense Category</label>
            <select
              name="category"
              required
              className="input-field font-bold text-sm"
            >
              <option value="COGS">Botanical Ingredients (COGS)</option>
              <option value="Packaging">Vessels & Packaging</option>
              <option value="Marketing">Growth & Marketing</option>
              <option value="Salary">Labor & Human Connection</option>
              <option value="Rent">Physical Sanctuary (Rent)</option>
              <option value="Utilities">Utilities & Flow</option>
              <option value="Other">Miscellaneous</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">04 / Valuation (-$)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="input-field text-lg font-black text-tertiary placeholder:opacity-20"
            />
          </div>

          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">05 / Chronology</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="input-field font-bold text-sm"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">06 / Audit Reference (Invoice #)</label>
            <input
              name="reference"
              type="text"
              placeholder="Optional reference identifier"
              className="input-field font-mono font-bold text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-surface-container-high">
          <Link href="/expenses" className="btn-secondary">
            Abort
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-30"
          >
            <Save size={18} className="mr-3" />
            {loading ? "Archiving..." : "Finalize Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
