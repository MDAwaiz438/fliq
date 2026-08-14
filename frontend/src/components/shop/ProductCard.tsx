"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { isProductWishlisted, toggleCustomerWishlist } from "@/lib/wishlist";

export interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  tag?: string;
  isNew?: boolean;
}

export default function ProductCard({
  slug,
  title,
  price,
  originalPrice,
  image,
  tag,
  isNew
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isProductWishlisted(slug));
    const handleUpdated = () => {
      setIsWishlisted(isProductWishlisted(slug));
    };
    window.addEventListener("fliq_wishlist_updated", handleUpdated);
    return () => window.removeEventListener("fliq_wishlist_updated", handleUpdated);
  }, [slug]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = toggleCustomerWishlist(slug);
    if (res.success && res.isWishlisted !== undefined) {
      setIsWishlisted(res.isWishlisted);
    }
  };

  return (
    <Link href={`/product/${slug}`} className="group flex flex-col w-full text-left font-body cursor-pointer">

      {/* Clean Light Studio Image Framing */}
      <div className="relative aspect-3/4 w-full bg-zinc-100 overflow-hidden rounded-xs block">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 16vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-white transition-all cursor-pointer shadow-2xs"
          title="Add to Wishlist"
        >
          <Heart size={13} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>

        {/* Bottom-Left Clean Badge (Does not obstruct model's face or upper body) */}
        {(isNew || tag) && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 z-10">
            <span className="bg-zinc-950/85 backdrop-blur-xs text-white font-mono text-[8px] sm:text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider rounded-xs shadow-xs border border-white/10">
              {isNew ? "NEW" : tag}
            </span>
          </div>
        )}
      </div>

      {/* Snitch / Urban Fashion Brand Typography */}
      <div className="pt-2 flex flex-col justify-between flex-1">
        <h3 className="font-body text-xs text-zinc-900 font-normal tracking-tight line-clamp-1 group-hover:text-acid transition-colors">
          {title}
        </h3>

        {/* Geometric High-Fashion Pricing (Outfit Font) */}
        <div className="flex items-baseline gap-2.5 mt-1">
          <span className="font-price font-semibold text-xs sm:text-sm text-zinc-900 tracking-tight flex items-baseline gap-1">
            <span>₹</span>
            <span>{price}</span>
          </span>
          {originalPrice && (
            <span className="font-price text-[11px] text-zinc-400 line-through font-normal tracking-tight flex items-baseline gap-0.5">
              <span>₹</span>
              <span>{originalPrice}</span>
            </span>
          )}
        </div>
      </div>

    </Link>
  );
}
