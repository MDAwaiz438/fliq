// FLIQ Customer Wishlist & Auth Helper

export function isCustomerAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("flq_token"));
}

export function getCustomerWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("flq_wishlist");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isProductWishlisted(slug: string): boolean {
  return getCustomerWishlist().includes(slug);
}

export function toggleCustomerWishlist(slug: string): { success: boolean; requiresAuth?: boolean; isWishlisted?: boolean } {
  if (!isCustomerAuthenticated()) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("fliq_auth_required", {
          detail: { action: "wishlist", productSlug: slug }
        })
      );
    }
    return { success: false, requiresAuth: true };
  }

  const current = getCustomerWishlist();
  let updated: string[];
  let newState = false;

  if (current.includes(slug)) {
    updated = current.filter((s) => s !== slug);
    newState = false;
  } else {
    updated = [...current, slug];
    newState = true;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("flq_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("fliq_wishlist_updated"));
  }

  return { success: true, isWishlisted: newState };
}

export function markAsWishlisted(slug: string) {
  if (!isCustomerAuthenticated()) return;
  const current = getCustomerWishlist();
  if (!current.includes(slug)) {
    const updated = [...current, slug];
    localStorage.setItem("flq_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("fliq_wishlist_updated"));
  }
}
