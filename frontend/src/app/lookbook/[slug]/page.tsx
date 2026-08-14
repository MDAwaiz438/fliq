"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function LookbookDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const title = slug ? slug.replace(/-/g, " ").toUpperCase() : "AW26 — DISTORTION ARCHITECTURE";

  const images = [
    { id: 1, src: "/images/product_distortion.png", title: "LOOK 01 — DISTORTION HOODIE & CARGO", productSlug: "distortion-hoodie" },
    { id: 2, src: "/images/polo_knit.png", title: "LOOK 02 — TOUCH GRASS KNIT POLO", productSlug: "touch-grass-knit-polo" },
    { id: 3, src: "/images/shirt_viscose.png", title: "LOOK 03 — VISCOSE EMBROIDERED BOX FIT", productSlug: "viscose-embroidered-shirt" },
    { id: 4, src: "/images/tank_maroon_1.jpg", title: "LOOK 04 — VINTAGE ACID WASH TANK", productSlug: "vintage-acid-wash-tank-top" },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/lookbook" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO LOOKBOOKS
      </Link>

      <div className="border-b border-bone pb-6 mb-10">
        <span className="font-mono text-xs font-bold text-acid uppercase tracking-widest block mb-1">EDITORIAL STORY</span>
        <h1 className="font-display text-4xl sm:text-6xl text-bone uppercase tracking-tight">{title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((item) => (
          <div key={item.id} className="bg-white border border-zinc-200 rounded-sm p-4 group hover:border-acid transition-colors shadow-xs">
            <div className="relative aspect-4/5 bg-obsidian mb-4 rounded-xs overflow-hidden">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm uppercase text-bone">{item.title}</span>
              <Link
                href={`/product/${item.productSlug}`}
                className="bg-bone text-white font-heading font-bold text-xs uppercase px-3 py-1.5 hover:bg-acid transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag size={14} /> SHOP LOOK
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
