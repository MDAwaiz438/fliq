"use server";

import { revalidatePath } from "next/cache";
import { DUMMY_PRODUCTS } from "@/lib/data";

export async function getInventoryAlerts() {
  const alerts = [];
  for (const product of DUMMY_PRODUCTS) {
    for (const variant of product.variants) {
      if (variant.stock <= variant.lowStock) {
        alerts.push({ ...variant, product });
      }
    }
  }
  return alerts;
}

export async function updateStock(variantId: string, newStock: number) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
}

export async function addVariant(productId: string, data: { size: string, sku: string, stock: number, lowStock: number }) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
}

export async function deleteVariant(variantId: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
}
