"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

export default function SubcategoryPLPPage() {
  const params = useParams();
  const rawCat = (params?.category as string) || "hoodies";
  const rawSub = (params?.subcategory as string) || "oversized";
  const categoryName = rawCat.replace(/-/g, " ").toUpperCase();
  const subcategoryName = rawSub.replace(/-/g, " ").toUpperCase();

  const products = [
    {
      id: "prod_6",
      slug: "distortion-hoodie",
      title: "Distortion Oversized Hoodie (Drop 03)",
      category: categoryName,
      price: 3499,
      originalPrice: 4499,
      image: "/images/product_distortion.png",
      tag: "DROP 03",
    },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="flex items-center gap-2 font-mono text-xs text-muted mb-4">
        <Link href="/shop" className="hover:text-acid">SHOP</Link>
        <ChevronRight size={12} />
        <Link href={`/shop/${rawCat}`} className="hover:text-acid">{categoryName}</Link>
        <ChevronRight size={12} />
        <span className="text-bone font-bold">{subcategoryName}</span>
      </div>

      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">{categoryName} SUBCATEGORY</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">{subcategoryName}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
