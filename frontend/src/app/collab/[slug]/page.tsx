"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

export default function CollabDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const collabTitle = slug ? slug.replace(/-/g, " ").toUpperCase() : "FLIQ × TOKYO UNDERGROUND";

  const products = [
    {
      id: "prod_6",
      slug: "distortion-hoodie",
      title: "Distortion Oversized Hoodie (Drop 03)",
      category: "HOODIES",
      price: 3499,
      originalPrice: 4499,
      image: "/images/product_distortion.png",
      tag: "COLLAB",
    },
    {
      id: "prod_5",
      slug: "touch-grass-knit-polo",
      title: "Touch Grass Club Embroidered Polo T-Shirt",
      category: "T-SHIRTS",
      price: 1499,
      originalPrice: 1999,
      image: "/images/polo_knit.png",
      tag: "COLLAB",
    },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/collab" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO COLLABS
      </Link>

      <div className="bg-bone text-white p-8 sm:p-14 rounded-sm mb-12 relative overflow-hidden">
        <span className="font-mono text-xs font-bold text-acid uppercase tracking-widest block mb-2">LIMITED CREATIVE CAPSULE</span>
        <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-white mb-4">{collabTitle}</h1>
        <p className="text-zinc-300 text-sm max-w-2xl leading-relaxed">
          Combining FLIQ’s raw edge architecture with Tokyo digital subculture typography. Engineered with heavy loopback cotton and cybernetic metallic hardware.
        </p>
      </div>

      <h2 className="font-heading font-bold text-2xl uppercase tracking-wider text-bone mb-6">CAPSULE PIECES</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
