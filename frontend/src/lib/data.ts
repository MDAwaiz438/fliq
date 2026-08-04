export interface ProductVariant {
  id: string;
  size: string;
  sku: string;
  stock: number;
  lowStock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string;
  images: string[];
  description?: string;
  isNew?: boolean;
  variants: ProductVariant[];
}

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Oversized Hoodie",
    price: 120,
    category: "Apparel",
    color: "Black",
    images: ["/prod-1.jpg", "/prod-2.jpg"],
    description: "Heavyweight 500gsm cotton fleece. Drop shoulder fit. Designed for the concrete jungle. Raw form, maximum utility.",
    isNew: true,
    variants: [
      { id: "v-1-1", size: "S", sku: "HD-BLK-S", stock: 15, lowStock: 5 },
      { id: "v-1-2", size: "M", sku: "HD-BLK-M", stock: 25, lowStock: 5 },
      { id: "v-1-3", size: "L", sku: "HD-BLK-L", stock: 10, lowStock: 5 },
      { id: "v-1-4", size: "XL", sku: "HD-BLK-XL", stock: 3, lowStock: 5 },
    ]
  },
  {
    id: "prod-2",
    name: "Modular Sneaker",
    price: 180,
    category: "Footwear",
    color: "White",
    images: ["/prod-3.jpg", "/prod-4.jpg"],
    description: "Utilitarian footwear featuring a chunky Vibram sole, layered technical mesh, and speed lacing system.",
    isNew: true,
    variants: [
      { id: "v-2-1", size: "8", sku: "SNK-WHT-8", stock: 8, lowStock: 3 },
      { id: "v-2-2", size: "9", sku: "SNK-WHT-9", stock: 12, lowStock: 3 },
      { id: "v-2-3", size: "10", sku: "SNK-WHT-10", stock: 15, lowStock: 3 },
      { id: "v-2-4", size: "11", sku: "SNK-WHT-11", stock: 5, lowStock: 3 },
    ]
  },
  {
    id: "prod-3",
    name: "Tech Cargo Pants",
    price: 140,
    category: "Apparel",
    color: "Black",
    images: ["/prod-2.jpg", "/prod-1.jpg"],
    description: "Water-repellent ripstop nylon. Eight articulated pockets. Articulated knees for full range of motion.",
    isNew: false,
    variants: [
      { id: "v-3-1", size: "28", sku: "CRG-BLK-28", stock: 10, lowStock: 4 },
      { id: "v-3-2", size: "30", sku: "CRG-BLK-30", stock: 18, lowStock: 4 },
      { id: "v-3-3", size: "32", sku: "CRG-BLK-32", stock: 22, lowStock: 4 },
      { id: "v-3-4", size: "34", sku: "CRG-BLK-34", stock: 12, lowStock: 4 },
    ]
  },
  {
    id: "prod-4",
    name: "Utility Vest",
    price: 110,
    category: "Apparel",
    color: "Black",
    images: ["/prod-4.jpg"],
    description: "Tactical layering piece. Multiple concealed zip pockets. Heavy-duty hardware and adjustable webbing straps.",
    isNew: true,
    variants: [
      { id: "v-4-1", size: "M", sku: "VST-BLK-M", stock: 0, lowStock: 5 },
      { id: "v-4-2", size: "L", sku: "VST-BLK-L", stock: 5, lowStock: 5 },
    ]
  },
  {
    id: "prod-5",
    name: "Brutalist Tee",
    price: 65,
    category: "Apparel",
    color: "White",
    images: ["/prod-1.jpg"],
    description: "Boxy fit heavyweight t-shirt. Clean lines, dropped shoulders, raw hems.",
    isNew: false,
    variants: [
      { id: "v-5-1", size: "M", sku: "TEE-WHT-M", stock: 50, lowStock: 10 },
      { id: "v-5-2", size: "L", sku: "TEE-WHT-L", stock: 45, lowStock: 10 },
      { id: "v-5-3", size: "XL", sku: "TEE-WHT-XL", stock: 30, lowStock: 10 },
    ]
  },
  {
    id: "prod-6",
    name: "Combat Boots",
    price: 220,
    category: "Footwear",
    color: "Black",
    images: ["/prod-3.jpg"],
    description: "Full-grain leather combat boot with lugged rubber outsole and medial zip closure.",
    isNew: false,
    variants: [
      { id: "v-6-1", size: "9", sku: "BT-BLK-9", stock: 10, lowStock: 2 },
      { id: "v-6-2", size: "10", sku: "BT-BLK-10", stock: 15, lowStock: 2 },
    ]
  }
];

export async function getProducts(): Promise<Product[]> {
  return DUMMY_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return DUMMY_PRODUCTS.find(p => p.id === id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return DUMMY_PRODUCTS.filter(p => p.category === category);
}
