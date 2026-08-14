"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import {
  ProductItem,
  getAllProductsSync,
  fetchAllProducts,
  CategoryItem,
  getAllCategoriesSync
} from "@/lib/products";

export default function CategoryPLPPage() {
  const params = useParams();
  const rawCat = (params?.category as string) || "hoodies";
  const categorySlug = rawCat.toLowerCase();
  const categoryName = rawCat.replace(/-/g, " ").toUpperCase();

  const [products, setProducts] = useState<ProductItem[]>(() => getAllProductsSync());
  const [categories, setCategories] = useState<CategoryItem[]>(() => getAllCategoriesSync());

  useEffect(() => {
    setProducts(getAllProductsSync());
    setCategories(getAllCategoriesSync());
    fetchAllProducts().then((latest) => setProducts(latest));

    const handleUpdated = () => {
      setProducts(getAllProductsSync());
      setCategories(getAllCategoriesSync());
      fetchAllProducts().then((latest) => setProducts(latest));
    };
    window.addEventListener("fliq_products_updated", handleUpdated);
    window.addEventListener("fliq_categories_updated", handleUpdated);
    return () => {
      window.removeEventListener("fliq_products_updated", handleUpdated);
      window.removeEventListener("fliq_categories_updated", handleUpdated);
    };
  }, []);

  // Find matched category configuration
  const matchedCategory = categories.find((c) => {
    const cSlug = c.slug.toLowerCase();
    const cName = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return cSlug === categorySlug || cName === categorySlug || categorySlug.includes(cSlug) || cSlug.includes(categorySlug);
  });

  const categoryProducts = products.filter((p) => {
    if (!p.category) return false;
    const norm = p.category.toLowerCase().replace(/-/g, " ");
    const search = categoryName.toLowerCase();
    return norm.includes(search) || search.includes(norm) || (matchedCategory && p.category.toUpperCase() === matchedCategory.name.toUpperCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-20 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-6">
        <Link href="/shop" className="hover:text-acid transition-colors">
          SHOP
        </Link>
        <ChevronRight size={12} />
        <span className="text-zinc-900 font-bold uppercase">{categoryName}</span>
      </div>

      {/* Hero Category Banner */}
      <div className="bg-zinc-950 text-white rounded-2xl p-6 sm:p-10 mb-10 relative overflow-hidden border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-white/10 text-white px-2.5 py-0.5 rounded">
                CATEGORY ATELIER
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-2">
              {matchedCategory?.name || categoryName}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm font-mono max-w-xl leading-relaxed">
              {matchedCategory?.subtitle || "Tailored with heavyweight custom fabrics and architectural streetwear cuts."}
            </p>
          </div>

          {matchedCategory?.image && (
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden relative border border-white/20 shadow-2xl shrink-0">
              <Image src={matchedCategory.image} alt={categoryName} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500 font-mono text-xs border border-zinc-200 rounded-2xl bg-zinc-50 flex flex-col items-center gap-3">
          <p>No garments currently in the &quot;{categoryName}&quot; drop.</p>
          <Link
            href="/shop"
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-mono uppercase font-bold hover:bg-black"
          >
            Explore All Products
          </Link>
        </div>
      )}
    </div>
  );
}
