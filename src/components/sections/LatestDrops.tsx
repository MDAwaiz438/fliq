import Link from "next/link";
import { getProducts } from "@/app/actions/products";
import { Product } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight } from "lucide-react";

export default async function LatestDrops() {
  const dbProducts = await getProducts();
  const products: Product[] = dbProducts.map(p => ({
    ...p,
    images: JSON.parse(p.images)
  }));
  const displayedProducts = products.slice(0, 4);

  return (
    <section className="w-full border-b border-(--border)">
      <div className="p-6 md:p-8 lg:p-12 border-b border-(--border) flex items-end justify-between">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl lg:text-6xl font-bold uppercase tracking-tighter text-(--text-primary)">
          Latest <span className="text-(--accent)">Drops</span>
        </h2>
        <Link href="/products" className="uppercase font-bold text-xs md:text-sm tracking-widest text-(--text-muted) hover:text-(--accent) transition-colors hidden md:flex items-center gap-2 group">
          View All
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" style={{ transitionTimingFunction: 'var(--ease-out)' }} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-(--border)">
        {displayedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
