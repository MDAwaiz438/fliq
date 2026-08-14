// Customer Purchase & Order Verification Helper (Anti-Spam & Verified Reviews)

export interface CustomerPurchasedItem {
  slug: string;
  orderId: string;
  purchasedAt: string;
  productName: string;
}

const DEFAULT_VERIFIED_PURCHASES: CustomerPurchasedItem[] = [
  {
    slug: "100-viscose-embroidered-box-fit-shirt",
    orderId: "FLIQ-10492",
    purchasedAt: "2026-05-18",
    productName: "100% Viscose Embroidered Box Fit Shirt"
  },
  {
    slug: "viscose-embroidered-shirt",
    orderId: "FLIQ-10492",
    purchasedAt: "2026-05-18",
    productName: "100% Viscose Embroidered Box Fit Shirt"
  },
  {
    slug: "distortion-hoodie",
    orderId: "FLIQ-10842",
    purchasedAt: "2026-08-12",
    productName: "Distortion Oversized Hoodie (Drop 03)"
  }
];

export function getCustomerPurchasedProducts(): CustomerPurchasedItem[] {
  if (typeof window === "undefined") return DEFAULT_VERIFIED_PURCHASES;
  try {
    const raw = localStorage.getItem("flq_verified_purchases");
    if (!raw) {
      localStorage.setItem("flq_verified_purchases", JSON.stringify(DEFAULT_VERIFIED_PURCHASES));
      return DEFAULT_VERIFIED_PURCHASES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_VERIFIED_PURCHASES;
  }
}

export function recordCustomerPurchase(items: { slug: string; name: string }[], orderId: string) {
  if (typeof window === "undefined") return;
  const current = getCustomerPurchasedProducts();
  const newPurchases: CustomerPurchasedItem[] = items.map((item) => ({
    slug: item.slug.toLowerCase(),
    orderId,
    purchasedAt: new Date().toISOString().split("T")[0],
    productName: item.name
  }));

  const merged = [...current, ...newPurchases];
  localStorage.setItem("flq_verified_purchases", JSON.stringify(merged));
  window.dispatchEvent(new Event("fliq_purchases_updated"));
}

export function hasCustomerPurchasedProduct(productSlug: string): boolean {
  if (typeof window === "undefined") return false;
  const target = productSlug.toLowerCase();
  const purchases = getCustomerPurchasedProducts();

  return purchases.some((p) => {
    const s = p.slug.toLowerCase();
    return s === target || target.includes(s) || s.includes(target);
  });
}
