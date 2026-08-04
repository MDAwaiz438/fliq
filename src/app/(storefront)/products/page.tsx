import { getProducts } from "@/app/actions/products";
import { Product } from "@/lib/data";
import ProductGrid from "@/components/ui/ProductGrid";

export const metadata = {
  title: 'Shop | FLIQ',
  description: 'Browse the full collection of FLIQ streetwear — apparel, footwear, and accessories.',
};

export default async function ProductsPage() {
  const dbProducts = await getProducts();
  const products: Product[] = dbProducts.map(p => ({
    ...p,
    images: JSON.parse(p.images)
  }));

  return (
    <div className="min-h-screen bg-(--bg) pt-8">
      <div className="px-6 md:px-12 mb-8">
        <h1 className="font-(family-name:--font-display) text-5xl md:text-7xl font-bold uppercase tracking-tighter text-(--text-primary) border-b border-(--border) pb-4">
          All <span className="text-(--accent)">Products</span>
        </h1>
      </div>
      
      <ProductGrid initialProducts={products} />
    </div>
  );
}
