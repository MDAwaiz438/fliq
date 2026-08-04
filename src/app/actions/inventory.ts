"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInventoryAlerts() {
  const variants = await prisma.productVariant.findMany({
    include: { product: true }
  });
  
  // Filter where stock <= lowStock since direct column comparison isn't straightforward in all Prisma versions
  return variants.filter(v => v.stock <= v.lowStock);
}

export async function updateStock(variantId: string, newStock: number) {
  await prisma.productVariant.update({
    where: { id: variantId },
    data: { stock: newStock }
  });
  
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
}

export async function addVariant(productId: string, data: { size: string, sku: string, stock: number, lowStock: number }) {
  await prisma.productVariant.create({
    data: {
      productId,
      size: data.size,
      sku: data.sku,
      stock: data.stock,
      lowStock: data.lowStock
    }
  });
  
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
}

export async function deleteVariant(variantId: string) {
  await prisma.productVariant.delete({
    where: { id: variantId }
  });
  
  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
}
