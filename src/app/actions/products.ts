"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true }
  });
}

export async function searchProducts(query: string) {
  return await prisma.product.findMany({
    where: {
      name: {
        contains: query,
      }
    },
    include: { variants: true }
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { variants: true }
  });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createProduct(data: { name: string, price: number, category: string, color: string, images: string }) {
  await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      category: data.category,
      color: data.color,
      images: data.images,
      isNew: true
    }
  });
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  revalidatePath("/");
}
