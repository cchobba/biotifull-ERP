"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: string;
  stockQuantity: number;
};

type Customer = {
  id: number;
  name: string;
};

type OrderItem = {
  productId: number;
  quantity: number;
  price: string;
};

export function OrderForm({ 
  customers, 
  products 
}: { 
  customers: Customer[]; 
  products: Product[]; 
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<number | "">("");
  const [amountPaid, setAmountPaid] = useState<string>("0");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1, price: "0" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill price when product changes
    if (field === "productId") {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        newItems[index].price = product.price;
      }
    }
    
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert("Please add at least one item");
    
    // Validation: Check if any item has no product selected
    if (items.some(item => item.productId === 0)) {
      return alert("Please select a product for all items");
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, items, total, amountPaid }),
      });

      if (response.ok) {
        router.push("/orders");
        router.refresh();
      } else {
        const errorText = await response.text();
        alert(`Failed to create order: ${errorText || response.statusText}`);
      }
    } catch (err) {
      alert("An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Customer Information</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Customer</label>
          <select
            required
            value={customerId}
            onChange={(e) => setCustomerId(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">-- Choose a customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-100 flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-end border-b pb-4 last:border-0">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500">Product</label>
                <select
                  required
                  value={item.productId}
                  onChange={(e) => updateItem(index, "productId", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="0">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stockQuantity <= 0}>
                      {p.name} ({p.sku}) - ${p.price} [Stock: {p.stockQuantity}]
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-500">Qty</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-gray-500">Price</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    readOnly
                    value={item.price}
                    className="block w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 pl-6 text-sm text-gray-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-center py-4 text-gray-500 text-sm italic">
              No items added yet. Click "Add Item" to begin.
            </p>
          )}
        </div>

        <div className="flex justify-between items-end pt-4 border-t border-gray-200">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700">Initial Amount Paid ($)</label>
            <input
              type="number"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</p>
            <p className="text-sm text-red-500 font-medium">Remaining: ${(total - parseFloat(amountPaid || "0")).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="px-6 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 flex items-center disabled:opacity-50"
        >
          <Save size={18} className="mr-2" />
          {loading ? "Processing..." : "Create Order"}
        </button>
      </div>
    </form>
  );
}
