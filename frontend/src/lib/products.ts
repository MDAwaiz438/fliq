import { BACKEND_URL } from "./api";

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  colors?: Array<{ name: string; hex: string }>;
  tag?: string;
  isNew?: boolean;
  description?: string;
  details?: string[];
  fabric?: string;
  fabricGsm?: string;
  fitProfile?: string;
  hsnCode?: string;
  sizes?: string[];
  inventoryQuantity?: number;
  sku?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  image: string;
  isFeatured: boolean;
  highlightTag?: string;
  sortOrder?: number;
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat_1",
    name: "CASUAL SHIRTS",
    slug: "casual-shirts",
    subtitle: "100% VISCOSE & LINEN",
    image: "/images/shirt_viscose.png",
    isFeatured: true,
    highlightTag: "SUMMER 26",
    sortOrder: 1
  },
  {
    id: "cat_2",
    name: "HEAVYWEIGHT HOODIES",
    slug: "hoodies",
    subtitle: "450GSM FRENCH TERRY",
    image: "/images/product_distortion.png",
    isFeatured: true,
    highlightTag: "DROP 03",
    sortOrder: 2
  },
  {
    id: "cat_3",
    name: "OVERSIZED TEES",
    slug: "oversized-tees",
    subtitle: "DROP SHOULDER TAILORING",
    image: "/images/hero.png",
    isFeatured: true,
    highlightTag: "HOT DROP",
    sortOrder: 3
  },
  {
    id: "cat_4",
    name: "UTILITY CARGOS",
    slug: "cargo-pants",
    subtitle: "REINFORCED TWILL & CHINOS",
    image: "/images/chinos_cream.png",
    isFeatured: true,
    highlightTag: "ESSENTIAL",
    sortOrder: 4
  },
  {
    id: "cat_5",
    name: "KNITTED POLOS",
    slug: "polos",
    subtitle: "RETRO CLUB EMBROIDERED",
    image: "/images/polo_knit.png",
    isFeatured: true,
    highlightTag: "ATELIER EXCLUSIVE",
    sortOrder: 5
  },
  {
    id: "cat_6",
    name: "OUTERWEAR",
    slug: "outerwear",
    subtitle: "DENIM & TACTICAL JACKETS",
    image: "/images/editorial.png",
    isFeatured: true,
    highlightTag: "LIMITED",
    sortOrder: 6
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod_1",
    slug: "viscose-embroidered-shirt",
    title: "100% Viscose Embroidered Box Fit Shirt",
    category: "SHIRTS",
    price: 1099,
    originalPrice: 1599,
    image: "/images/shirt_viscose.png",
    images: ["/images/shirt_viscose.png", "/images/hero.png", "/images/editorial.png", "/images/product_distortion.png"],
    tag: "NEW",
    isNew: true,
    description: "Relaxed box-fit Cuban collar shirt constructed from 100% breathable Viscose rayon fabric. Features hand-embroidered resort motifs, dropped shoulder tailoring, and tonal mother-of-pearl buttons.",
    details: ["100% Premium Viscose Rayon", "Hand-embroidered resort graphics", "Boxy relaxed Cuban collar silhouette", "Cold gentle machine wash"],
    fabric: "100% Viscose Rayon (160GSM)",
    fabricGsm: "160 GSM Viscose",
    fitProfile: "Relaxed Box Fit",
    colors: [
      { name: "Cream White", hex: "#FDFBF7" },
      { name: "Onyx Black", hex: "#09090B" },
      { name: "Cobalt Blue", hex: "#2563EB" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "prod_2",
    slug: "brown-regular-fit-shirt",
    title: "Brown Regular Fit Shirt",
    category: "SHIRTS",
    price: 1299,
    originalPrice: 1799,
    image: "/images/shirt_brown.png",
    images: ["/images/shirt_brown.png", "/images/editorial.png", "/images/shirt_viscose.png", "/images/hero.png"],
    description: "Versatile regular-fit unbuttoned outer shirt crafted from breathable French linen cotton blend. Designed for effortless layering over basic tees.",
    details: ["French Linen Cotton blend", "Curved hem design", "Soft washed finish for vintage hand-feel"],
    fabric: "65% Linen, 35% Combed Cotton",
    colors: [
      { name: "Earth Brown", hex: "#5D4037" },
      { name: "Onyx Black", hex: "#09090B" }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod_3",
    slug: "mauve-regular-fit-shirt",
    title: "Mauve Regular Fit Shirt",
    category: "SHIRTS",
    price: 1299,
    originalPrice: 1799,
    image: "/images/shirt_mauve.png",
    images: ["/images/shirt_mauve.png", "/images/shirt_viscose.png", "/images/hero.png", "/images/editorial.png"],
    description: "Lightweight mauve linen shirt featuring clean stitch lines, soft spread collar, and rollable cuffs. Perfect for warm climate layering.",
    details: ["100% Washed Linen", "Breathable open weave", "Resin horn buttons"],
    fabric: "100% Linen",
    colors: [
      { name: "Mauve Pink", hex: "#D8B4FE" },
      { name: "Bone White", hex: "#FAFAFA" }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod_4",
    slug: "cream-straight-fit-chinos",
    title: "Cream Straight Fit Chinos",
    category: "CARGO PANTS",
    price: 1599,
    originalPrice: 2199,
    image: "/images/chinos_cream.png",
    images: ["/images/chinos_cream.png", "/images/editorial.png", "/images/hero.png", "/images/product_distortion.png"],
    description: "Straight-leg utility chinos tailored from heavyweight cotton twill. Features deep coin pockets, reinforced belt loops, and an easy relaxed break.",
    details: ["100% Cotton Twill", "YKK metal zipper fly", "Straight leg tailored drape"],
    fabric: "100% Heavyweight Cotton Twill (320GSM)",
    colors: [
      { name: "Cream White", hex: "#F5F5DC" },
      { name: "Stealth Charcoal", hex: "#27272A" }
    ],
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: "prod_5",
    slug: "touch-grass-knit-polo",
    title: "Touch Grass Club Embroidered Polo T-Shirt",
    category: "T-SHIRTS",
    price: 1499,
    originalPrice: 1999,
    image: "/images/polo_knit.png",
    images: ["/images/polo_knit.png", "/images/hero.png", "/images/product_distortion.png", "/images/editorial.png"],
    tag: "HOT",
    isNew: true,
    description: "Heavyweight colorblocked knit polo featuring contrast green and navy paneling with signature chest embroidery crest.",
    details: ["Jacquard knitted cotton blend", "Retro notch collar with no buttons", "Embroidered chest crest"],
    fabric: "100% Combed Knitted Cotton (260GSM)",
    colors: [
      { name: "Forest Green", hex: "#14532D" },
      { name: "Midnight Navy", hex: "#0F172A" }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod_6",
    slug: "distortion-hoodie",
    title: "Distortion Oversized Hoodie (Drop 03)",
    category: "HOODIES",
    price: 3499,
    originalPrice: 4499,
    image: "/images/product_distortion.png",
    images: ["/images/product_distortion.png", "/images/hero.png", "/images/editorial.png"],
    tag: "DROP 03",
    description: "450GSM Heavyweight loopback 100% cotton fleece with raw-edge distressed seam work and signature double-layer streetwear hood.",
    details: ["450GSM Loopback Cotton", "Raw-edge seam distress tailoring", "Oversized boxy drop shoulder silhouette"],
    fabric: "450 GSM Heavyweight Loopback Cotton",
    colors: [
      { name: "Onyx Black", hex: "#09090B" },
      { name: "Heather Grey", hex: "#9CA3AF" }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod_7",
    slug: "vintage-acid-wash-tank-top",
    title: "Vintage Maroon Acid Wash Graphic Tank Top",
    category: "TANK TOPS",
    price: 1199,
    originalPrice: 1699,
    image: "/images/tank_maroon_1.jpg",
    images: ["/images/tank_maroon_1.jpg", "/images/hero.png", "/images/editorial.png"],
    tag: "NEW",
    isNew: true,
    description: "Vintage distressed wash aesthetic with heavyweight combed jersey cotton construction and raw ribbed armhole trim.",
    details: ["Acid washed vintage finish", "Raw edge distress trim", "Heavyweight 240GSM jersey"],
    fabric: "240 GSM Combed Cotton",
    colors: [
      { name: "Vintage Maroon", hex: "#881337" }
    ],
    sizes: ["S", "M", "L", "XL"]
  }
];

const LOCAL_STORAGE_KEY = "fliq_custom_products";

export function getCustomProductsFromStorage(): ProductItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read custom products from localStorage", err);
    return [];
  }
}

export function saveProductToStorage(product: ProductItem): ProductItem[] {
  if (typeof window === "undefined") return [product];
  try {
    const existing = getCustomProductsFromStorage();
    const index = existing.findIndex((p) => p.id === product.id || p.slug === product.slug);
    let updated: ProductItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...existing[index], ...product };
    } else {
      updated = [product, ...existing];
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("fliq_products_updated"));
    return updated;
  } catch (err) {
    console.error("Failed to save custom product to localStorage", err);
    return [];
  }
}

export function deleteProductFromStorage(productId: string): ProductItem[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getCustomProductsFromStorage();
    const updated = existing.filter((p) => p.id !== productId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("fliq_products_updated"));
    return updated;
  } catch (err) {
    console.error("Failed to delete custom product from localStorage", err);
    return [];
  }
}

function deduplicateProducts(items: ProductItem[]): ProductItem[] {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const result: ProductItem[] = [];

  for (const item of items) {
    const id = item.id || `prod_${item.slug}`;
    const slug = item.slug || item.id;
    if (!seenIds.has(id) && !seenSlugs.has(slug)) {
      seenIds.add(id);
      seenSlugs.add(slug);
      result.push(item);
    }
  }
  return result;
}

export function getAllProductsSync(): ProductItem[] {
  const custom = getCustomProductsFromStorage();
  const combined = [...custom, ...INITIAL_PRODUCTS];
  return deduplicateProducts(combined);
}

export async function fetchAllProducts(): Promise<ProductItem[]> {
  const syncProducts = getAllProductsSync();
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/products`);
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        const backendProducts: ProductItem[] = data.data.map((p: any) => ({
          id: p.id || `prod_${p.slug}`,
          slug: p.slug,
          title: p.title,
          category: p.category || "HOODIES",
          price: Number(p.price) || 2999,
          originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
          image: (p.images && p.images[0]) || p.image || "/images/product_distortion.png",
          images: p.images || [p.image || "/images/product_distortion.png"],
          colors: p.colors || [{ name: "Onyx Black", hex: "#09090B" }],
          description: p.description || "",
          details: p.details || [],
          fabric: p.fabricGsm || "450 GSM Heavyweight Loopback",
          fabricGsm: p.fabricGsm,
          fitProfile: p.fitProfile,
          hsnCode: p.hsnCode,
          tag: "NEW DROP",
          isNew: true,
          sizes: (p.variants && p.variants.map((v: any) => v.size)) || ["S", "M", "L", "XL"]
        }));

        return deduplicateProducts([...backendProducts, ...syncProducts]);
      }
    }
  } catch (err) {
    console.warn("Backend products API offline or unreachable, using local & cached catalogue:", err);
  }
  return syncProducts;
}

export function normalizeSlug(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/^100-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProductBySlugSync(slug: string): ProductItem | null {
  const all = getAllProductsSync();
  const targetNorm = normalizeSlug(slug);
  const found = all.find((p) => {
    if (p.slug === slug || p.id === slug) return true;
    const pNorm = normalizeSlug(p.slug);
    if (pNorm === targetNorm) return true;
    if (pNorm && targetNorm && (pNorm.includes(targetNorm) || targetNorm.includes(pNorm))) return true;
    return false;
  });
  return found || null;
}

// ---- Category Storage and Management ----

const LOCAL_CATEGORIES_KEY = "fliq_custom_categories";

export function getCustomCategoriesFromStorage(): CategoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read custom categories from localStorage", err);
    return [];
  }
}

export function getAllCategoriesSync(): CategoryItem[] {
  const custom = getCustomCategoriesFromStorage();
  const map = new Map<string, CategoryItem>();

  // Add initial
  for (const cat of INITIAL_CATEGORIES) {
    map.set(cat.id, cat);
  }
  // Overlay custom edits/additions
  for (const cat of custom) {
    map.set(cat.id, cat);
  }

  return Array.from(map.values()).sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
}

export function saveCategoryToStorage(cat: CategoryItem): CategoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getAllCategoriesSync();
    const existingIndex = current.findIndex((c) => c.id === cat.id || c.name.toUpperCase() === cat.name.toUpperCase());
    
    let updated: CategoryItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...cat };
    } else {
      updated = [...current, cat];
    }

    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("fliq_categories_updated"));

    // Sync to backend asynchronously
    fetch(`${BACKEND_URL}/api/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cat)
    }).catch(() => {});

    return updated;
  } catch (err) {
    console.error("Failed to save category to localStorage", err);
    return [];
  }
}

export function toggleCategoryFeatured(categoryId: string): CategoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getAllCategoriesSync();
    const target = current.find((c) => c.id === categoryId || c.slug === categoryId);
    if (target) {
      target.isFeatured = !target.isFeatured;
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event("fliq_categories_updated"));

      fetch(`${BACKEND_URL}/api/admin/categories/${categoryId}/toggle-featured`, {
        method: "PATCH"
      }).catch(() => {});
    }
    return current;
  } catch (err) {
    console.error("Failed to toggle category featured status", err);
    return [];
  }
}

export function deleteCategoryFromStorage(categoryId: string): CategoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getAllCategoriesSync();
    const updated = current.filter((c) => c.id !== categoryId && c.slug !== categoryId);
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("fliq_categories_updated"));

    fetch(`${BACKEND_URL}/api/admin/categories/${categoryId}`, {
      method: "DELETE"
    }).catch(() => {});

    return updated;
  } catch (err) {
    console.error("Failed to delete category from localStorage", err);
    return [];
  }
}

export async function fetchAllCategories(): Promise<CategoryItem[]> {
  const syncCategories = getAllCategoriesSync();
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/categories`);
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn("Backend categories API offline, using cached list:", err);
  }
  return syncCategories;
}
