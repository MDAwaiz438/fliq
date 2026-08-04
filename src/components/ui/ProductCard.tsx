import Link from "next/link";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group cursor-pointer bg-(--bg-card) h-full block border border-transparent hover:border-(--accent) transition-colors duration-200" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
      <div className="aspect-4/5 bg-(--bg-surface) relative overflow-hidden border-b border-(--border)">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        />
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-(--accent) text-(--bg) px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
            New
          </div>
        )}
      </div>
      <div className="p-4 md:p-5 flex justify-between items-start">
        <div>
          <h3 className="font-(family-name:--font-display) font-semibold uppercase text-xs md:text-sm text-(--text-primary)">{product.name}</h3>
          <p className="text-(--text-muted) text-[10px] md:text-xs font-semibold mt-1">
            {product.color} / 0{index + 1}
          </p>
        </div>
        <span className="font-bold text-sm md:text-base text-(--accent)">₹{product.price}</span>
      </div>
    </Link>
  );
}
