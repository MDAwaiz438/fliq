"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, LogIn, UserPlus } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { getAllProductsSync, ProductItem } from "@/lib/products";
import { getCustomerWishlist, isCustomerAuthenticated } from "@/lib/wishlist";

export default function AccountWishlistPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    setIsAuthenticated(isCustomerAuthenticated());
    setWishlistSlugs(getCustomerWishlist());
    setAllProducts(getAllProductsSync());

    const handleUpdated = () => {
      setIsAuthenticated(isCustomerAuthenticated());
      setWishlistSlugs(getCustomerWishlist());
      setAllProducts(getAllProductsSync());
    };

    window.addEventListener("fliq_wishlist_updated", handleUpdated);
    window.addEventListener("storage", handleUpdated);
    return () => {
      window.removeEventListener("fliq_wishlist_updated", handleUpdated);
      window.removeEventListener("storage", handleUpdated);
    };
  }, []);

  const wishlistedProducts = allProducts.filter((p) => wishlistSlugs.includes(p.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-20 font-sans">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> BACK TO DASHBOARD
      </Link>

      <div className="border-b border-zinc-200 pb-6 mb-8 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">
            SAVED GARMENTS
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 uppercase tracking-tight">
            MY WISHLIST ({isAuthenticated ? wishlistedProducts.length : 0})
          </h1>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="bg-white border border-zinc-200 p-8 sm:p-14 text-center rounded-2xl max-w-lg mx-auto shadow-xs flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center shadow-2xs">
            <Heart size={26} className="fill-red-500" />
          </div>

          <div>
            <h2 className="text-xl font-bold uppercase text-zinc-900 mb-1">
              LOG IN TO VIEW YOUR WISHLIST
            </h2>
            <p className="text-xs text-zinc-500 font-mono leading-relaxed">
              Sign in to sync your saved items across devices and receive exclusive restock notifications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Link
              href="/login"
              className="flex-1 py-3 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold uppercase rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={15} />
              <span>Log In</span>
            </Link>

            <Link
              href="/register"
              className="flex-1 py-3 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 text-xs font-mono font-bold uppercase rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      ) : wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 p-12 text-center rounded-2xl max-w-lg mx-auto shadow-xs">
          <Heart size={36} className="text-zinc-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold uppercase text-zinc-900 mb-1">YOUR WISHLIST IS EMPTY</h3>
          <p className="text-xs text-zinc-500 font-mono mb-6">
            Browse our latest drop collection and tap the heart icon to save garments.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-zinc-900 text-white font-mono font-bold text-xs uppercase px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-xs"
          >
            EXPLORE GARMENTS
          </Link>
        </div>
      )}
    </div>
  );
}
