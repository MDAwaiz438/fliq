"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, ShieldCheck, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

export default function DropDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const dropTitle = slug ? slug.replace(/-/g, " ").toUpperCase() : "DROP 03: DISTORTION";

  const products = [
    {
      id: "prod_6",
      slug: "distortion-hoodie",
      title: "Distortion Oversized Hoodie (Drop 03)",
      category: "HOODIES",
      price: 3499,
      originalPrice: 4499,
      image: "/images/product_distortion.png",
      tag: "DROP 03",
    },
    {
      id: "prod_1",
      slug: "viscose-embroidered-shirt",
      title: "100% Viscose Embroidered Box Fit Shirt",
      category: "SHIRTS",
      price: 1099,
      originalPrice: 1599,
      image: "/images/shirt_viscose.png",
      tag: "NEW",
    },
    {
      id: "prod_5",
      slug: "touch-grass-knit-polo",
      title: "Touch Grass Club Embroidered Polo T-Shirt",
      category: "T-SHIRTS",
      price: 1499,
      originalPrice: 1999,
      image: "/images/polo_knit.png",
      tag: "HOT",
    },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/drops" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO DROPS CALENDAR
      </Link>

      {/* Hero Banner */}
      <div className="bg-obsidian border border-zinc-200 p-8 sm:p-12 rounded-sm mb-12 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="font-mono text-xs font-bold text-acid tracking-widest uppercase block mb-2">FEATURED DROP CATALOG</span>
          <h1 className="font-display text-4xl sm:text-6xl text-bone uppercase mb-4 tracking-tight">{dropTitle}</h1>
          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            Constructed with heavyweight custom milled textiles, raw-edge contrast stitching, and hand-distressed detailing. Each garment in this collection is individually numbered and limited to 250 units worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-bone">
            <span className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-xs">
              <ShieldCheck size={16} className="text-acid" /> 100% AUTHENTIC ATELIER
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-xs">
              <Clock size={16} className="text-acid" /> RELEASED: AUGUST 2026
            </span>
          </div>
        </div>
      </div>

      {/* Drop Collection Products */}
      <h2 className="font-heading font-bold text-2xl uppercase tracking-wider text-bone mb-6 flex items-center gap-2">
        <ShoppingBag size={22} className="text-acid" /> COLLECTION GARMENTS ({products.length})
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
