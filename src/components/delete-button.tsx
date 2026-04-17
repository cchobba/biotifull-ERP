"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteButton({ 
  id, 
  module, 
  className 
}: { 
  id: number; 
  module: "customers" | "products" | "orders" | "payments";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete this ${module.slice(0, -1)}?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/${module}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.text();
        alert(`Failed to delete: ${error}`);
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={className}
      title={`Delete ${module.slice(0, -1)}`}
    >
      <Trash2 size={16} className={loading ? "animate-pulse" : ""} />
    </button>
  );
}
