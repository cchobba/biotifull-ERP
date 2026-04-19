import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = parseInt(id);

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, customerId))
    .limit(1);

  if (!customer) {
    notFound();
  }

  async function updateCustomer(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    await db
      .update(customers)
      .set({
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
      })
      .where(eq(customers.id, customerId));

    redirect("/customers");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/customers"
          className="p-2 rounded-xl hover:bg-white/50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Edit Customer</h2>
      </div>

      <form action={updateCustomer} className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-brand-sage/10 shadow-[0_20px_60px_rgba(141,163,153,0.05)] space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={customer.name}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              defaultValue={customer.email || ""}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
            <input
              name="phone"
              type="text"
              defaultValue={customer.phone || ""}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-sage-dark uppercase tracking-widest mb-1.5 ml-1">Address</label>
            <textarea
              name="address"
              rows={3}
              defaultValue={customer.address || ""}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/customers"
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
