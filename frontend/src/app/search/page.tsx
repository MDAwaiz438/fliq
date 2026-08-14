"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { ProductItem, getAllProductsSync, fetchAllProducts } from "@/lib/products";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [products, setProducts] = useState<ProductItem[]>(() => getAllProductsSync());

  useEffect(() => {
    setProducts(getAllProductsSync());
    fetchAllProducts().then((latest) => setProducts(latest));

    const handleUpdated = () => {
      setProducts(getAllProductsSync());
      fetchAllProducts().then((latest) => setProducts(latest));
    };
    window.addEventListener("fliq_products_updated", handleUpdated);
    return () => window.removeEventListener("fliq_products_updated", handleUpdated);
  }, []);

  const categories = ["ALL", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const results = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) || (p.category && p.category.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, selectedCategory]);

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      {/* Search Header */}
      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-2">CATALOG SEARCH</span>
        <div className="relative max-w-3xl">
          <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hoodies, shirts, polo, cargo, acid wash..."
            className="w-full bg-white border border-zinc-300 rounded-sm py-4 pl-12 pr-10 text-base font-body font-medium text-bone placeholder:text-zinc-400 focus:outline-none focus:border-acid focus:ring-1 focus:ring-acid shadow-xs"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-bone p-1"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="font-heading font-bold text-xs uppercase text-zinc-500 mr-2 flex items-center gap-1">
          <SlidersHorizontal size={14} /> FILTER:
        </span>
        {["ALL", "HOODIES", "SHIRTS", "T-SHIRTS", "CARGO PANTS", "TANK TOPS"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`font-heading font-bold text-xs uppercase px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              selectedCategory === cat ? "bg-bone text-white" : "bg-white border border-zinc-200 text-bone hover:border-acid"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading font-bold text-lg uppercase text-bone">
          {query ? `SEARCH RESULTS FOR "${query.toUpperCase()}"` : "ALL CATALOG ITEMS"}
        </h2>
        <span className="font-mono text-xs text-muted">
          {results.length} {results.length === 1 ? "RESULT" : "RESULTS"} FOUND
        </span>
      </div>

      {/* Product Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 p-12 text-center rounded-sm my-8">
          <h3 className="font-heading text-xl font-bold uppercase text-bone mb-2">NO MATCHING PRODUCTS</h3>
          <p className="text-zinc-500 text-xs mb-6 max-w-sm mx-auto">
            We couldn't find anything matching your search term. Try searching for "hoodie", "shirt", or "polo".
          </p>
          <button
            onClick={() => { setQuery(""); setSelectedCategory("ALL"); }}
            className="bg-bone text-white font-heading font-bold text-xs uppercase px-6 py-2.5 hover:bg-acid transition-colors"
          >
            CLEAR SEARCH & FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
