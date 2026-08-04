"use server";

import { prisma } from "@/lib/db";

export async function createOrder(data: {
  customerEmail: string,
  total: number,
  items: { variantId: string, quantity: number, price: number }[]
}) {
  // 1. Create the order
  const order = await prisma.order.create({
    data: {
      customer: data.customerEmail,
      total: data.total,
      status: "Processing",
      items: {
        create: data.items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });

  // 2. Decrement stock for each item
  for (const item of data.items) {
    await prisma.productVariant.update({
      where: { id: item.variantId },
      data: {
        stock: { decrement: item.quantity }
      }
    });
  }

  return { success: true, orderId: order.id };
}
