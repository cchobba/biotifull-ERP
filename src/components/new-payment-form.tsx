"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Wallet, Info } from "lucide-react";
import Link from "next/link";

type Customer = {
  id: number;
  name: string;
};

type Order = {
  id: number;
  customerId: number | null;
  totalAmount: string;
  amountPaid: string;
  status: string;
  createdAt: Date;
};

export function NewPaymentForm({ 
  customers, 
  initialOrders 
}: { 
  customers: Customer[];
  initialOrders: any[];
}) {
  const router = useRouter();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | "">("");
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("cash");
  const [loading, setLoading] = useState(false);

  // Filter orders for the selected customer
  const filteredOrders = useMemo(() => {
    if (!selectedCustomerId) return [];
    return initialOrders.filter(order => order.customerId === selectedCustomerId);
  }, [selectedCustomerId, initialOrders]);

  // Find details of the selected order
  const selectedOrderDetails = useMemo(() => {
    if (!selectedOrderId) return null;
    return initialOrders.find(o => o.id === selectedOrderId);
  }, [selectedOrderId, initialOrders]);

  const remainingBalance = selectedOrderDetails 
    ? parseFloat(selectedOrderDetails.totalAmount) - parseFloat(selectedOrderDetails.amountPaid)
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrderId || !amount || parseFloat(amount) <= 0) {
      return alert("Please select an order and enter a valid amount.");
    }

    if (parseFloat(amount) > remainingBalance) {
      if (!confirm(`The payment amount ($${amount}) is greater than the remaining balance ($${remainingBalance.toFixed(2)}). Continue?`)) return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderId,
          amount,
          method,
        }),
      });

      if (response.ok) {
        router.push("/payments");
        router.refresh();
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(11,28,48,0.03)] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1: Select Customer */}
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">01 / Identity</label>
            <div className="relative group">
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(parseInt(e.target.value));
                  setSelectedOrderId(""); // Reset order selection
                }}
                className="input-field font-bold text-sm appearance-none bg-surface-container-highest/50"
              >
                <option value="">Choose an Ambassador</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Select Order */}
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">02 / Associated Journal</label>
            <select
              required
              disabled={!selectedCustomerId || filteredOrders.length === 0}
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(parseInt(e.target.value))}
              className="input-field font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed appearance-none bg-surface-container-highest/50"
            >
              <option value="">{selectedCustomerId ? "Select Pending Order" : "Awaiting Ambassador..."}</option>
              {filteredOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  ORD-{o.id.toString().padStart(5, '0')} — ${parseFloat(o.totalAmount).toFixed(2)}
                </option>
              ))}
            </select>
            {selectedCustomerId && filteredOrders.length === 0 && (
              <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest ml-1">No pending orders found for this ambassador.</p>
            )}
          </div>
        </div>

        {/* Order Details & Calculation */}
        {selectedOrderDetails && (
          <div className="bg-surface-container-low p-8 rounded-[2rem] border border-white/50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white rounded-xl text-primary shadow-sm">
                <Info size={18} strokeWidth={3} />
              </div>
              <div>
                <h4 className="font-display font-black text-on-surface tracking-tight">Journal Reference: ORD-{selectedOrderDetails.id.toString().padStart(5, '0')}</h4>
                <p className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest mt-1">Logged on {new Date(selectedOrderDetails.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Total Valuation</p>
                <p className="text-xl font-black text-on-surface">${parseFloat(selectedOrderDetails.totalAmount).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Amount Settled</p>
                <p className="text-xl font-black text-primary">${parseFloat(selectedOrderDetails.amountPaid).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest text-tertiary">Outstanding Balance</p>
                <p className="text-xl font-black text-tertiary">${remainingBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-surface-container-high">
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">03 / Remittance Value ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-field text-lg font-black text-primary placeholder:opacity-20"
            />
          </div>
          <div className="space-y-4">
            <label className="label-sm-editorial block ml-1 opacity-50 text-[10px]">04 / Transmission Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input-field font-bold text-sm"
            >
              <option value="cash">Direct Cash</option>
              <option value="transfer">Bank Transmission</option>
              <option value="check">Certified Check</option>
              <option value="card">Card Payment</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/payments" className="btn-secondary">
          Abort
        </Link>
        <button
          type="submit"
          disabled={loading || !selectedOrderId || !amount}
          className="btn-primary disabled:opacity-30 disabled:grayscale"
        >
          <Save size={18} className="mr-3" />
          {loading ? "Reconciling..." : "Finalize Remittance"}
        </button>
      </div>
    </form>
  );
}
