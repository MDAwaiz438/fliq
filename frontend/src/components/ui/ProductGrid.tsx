"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";

export default function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filteredProducts = filter === "All" 
    ? initialProducts 
    : initialProducts.filter(p => p.category === filter);

  const categories = ["All", "Apparel", "Footwear", "Accessories"];

  return (
    <div>
      {/* Filter Bar */}
      <div className="px-6 md:px-12 py-4 border-b border-(--border) flex gap-3 overflow-x-auto hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 border whitespace-nowrap transition-all duration-200 ${
              filter === cat 
                ? "bg-(--accent) text-(--bg) border-(--accent)" 
                : "bg-transparent text-(--text-muted) border-(--border) hover:border-(--accent) hover:text-(--accent)"
            }`}
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-(--border) border-y border-(--border)">
        {filteredProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full p-12 bg-(--bg) text-center text-sm font-bold uppercase tracking-widest text-(--text-muted)">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
