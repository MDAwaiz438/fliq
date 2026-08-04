"use server";

import { revalidatePath } from "next/cache";
import { Product } from "@/lib/data";

export async function getProducts(): Promise<Product[]> {
  return [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  return [];
}

export async function getProductById(id: string): Promise<Product | null> {
  return null;
}

export async function deleteProduct(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function createProduct(data: any) {
  await new Promise(resolve => setTimeout(resolve, 300));
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  return { success: true };
}
