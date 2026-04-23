"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/auth";

export async function createProductAction(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const unitAmount = formData.get("unitAmount") as string || "1";
    const stockQuantity = parseInt(formData.get("stockQuantity") as string || "0");
    const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string || "5");

    await db.insert(products).values({
      name,
      sku,
      imageUrl: imageUrl || null,
      price,
      unit,
      unitAmount,
      stockQuantity: isNaN(stockQuantity) ? 0 : stockQuantity,
      lowStockThreshold: isNaN(lowStockThreshold) ? 5 : lowStockThreshold,
      isActive: true,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Action error:", error);
    return { success: false, error: error.message };
  }
}
