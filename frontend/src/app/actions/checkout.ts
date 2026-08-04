"use server";

export async function createOrder(data: {
  customerEmail: string,
  total: number,
  items: { variantId: string, quantity: number, price: number }[]
}) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a dummy order ID
  return { success: true, orderId: "ord_" + Math.random().toString(36).substring(2, 9) };
}
