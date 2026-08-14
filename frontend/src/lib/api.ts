export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface OrderInput {
  email: string;
  phone?: string;
  customerName?: string;
  paymentMethod: "CARD" | "UPI" | "NET_BANKING" | "WALLET" | "COD";
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export async function createBackendOrder(orderData: OrderInput) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to create order", err);
    throw err;
  }
}

export async function getShipmentTracking(awbCode: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/shiprocket/tracking/${awbCode}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch tracking details", err);
    throw err;
  }
}

export async function getAdminAnalytics() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/analytics`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch admin analytics", err);
    throw err;
  }
}
