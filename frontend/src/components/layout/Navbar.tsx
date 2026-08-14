"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, Menu, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import AuthPromptModal from "@/components/auth/AuthPromptModal";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { items, openCart } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <AuthPromptModal />
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 h-20 transition-all shadow-xs">
      <div className="w-full max-w-(--content-max) mx-auto px-(--content-pad-x) h-full flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button className="lg:hidden text-bone hover:text-acid transition-colors cursor-pointer">
          <Menu size={26} />
        </button>

        {/* Official FLIQ Logo */}
        <Link href="/" className="flex items-center gap-2 py-1">
          <Image
            src="/logo.svg"
            alt="FLIQ Logo"
            width={200}
            height={60}
            className="h-12 sm:h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links — Larger Font Size & Spacing */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          <Link href="/drops" className="font-heading font-bold text-sm uppercase text-bone hover:text-acid tracking-widest transition-colors h-full flex items-center relative group">
            DROPS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-acid transition-all group-hover:w-full"></span>
          </Link>
          
          <div className="group h-full flex items-center">
            <Link href="/shop" className="font-heading font-bold text-sm uppercase text-bone group-hover:text-acid tracking-widest transition-colors relative">
              SHOP
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-acid transition-all group-hover:w-full"></span>
            </Link>

            {/* Mega Menu */}
            <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top scale-y-95 group-hover:scale-y-100">
              <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) py-6 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase mb-3 tracking-wider text-acid border-b border-zinc-200 pb-2">CATEGORIES</h4>
                  <ul className="grid grid-cols-2 gap-y-2.5 font-body text-xs">
                    <li><Link href="/shop/hoodies" className="text-bone hover:text-acid transition-colors">Hoodies</Link></li>
                    <li><Link href="/shop/t-shirts" className="text-bone hover:text-acid transition-colors">T-Shirts</Link></li>
                    <li><Link href="/shop/shirts" className="text-bone hover:text-acid transition-colors">Shirts</Link></li>
                    <li><Link href="/shop/cargo-pants" className="text-bone hover:text-acid transition-colors">Cargo Pants</Link></li>
                    <li><Link href="/shop/polos" className="text-bone hover:text-acid transition-colors">Polos</Link></li>
                    <li><Link href="/shop/outerwear" className="text-bone hover:text-acid transition-colors">Outerwear</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase mb-3 tracking-wider text-acid border-b border-zinc-200 pb-2">FEATURED DROP</h4>
                  <div className="bg-obsidian p-4 rounded-sm border border-zinc-200 hover:border-acid transition-colors">
                    <h5 className="font-heading text-lg font-bold uppercase text-bone mb-1">DROP 03: DISTORTION</h5>
                    <p className="text-xs text-zinc-500 mb-4">Limited batch release. Ships globally.</p>
                    <Link href="/drops/drop-03-distortion" className="text-acid font-heading font-bold text-xs uppercase tracking-wider hover:underline">
                      SHOP DROP &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link href="/collab" className="font-heading font-bold text-sm uppercase text-bone hover:text-acid tracking-widest transition-colors h-full flex items-center relative group">
            COLLAB
          </Link>
          <Link href="/drops" className="font-heading font-bold text-sm uppercase text-bone hover:text-acid tracking-widest transition-colors h-full flex items-center relative group">
            ARCHIVE
          </Link>
          <Link href="/about" className="font-heading font-bold text-sm uppercase text-bone hover:text-acid tracking-widest transition-colors h-full flex items-center relative group">
            ABOUT
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-5 text-bone">
          <Link href="/search" className="hover:text-acid transition-colors cursor-pointer p-1" title="Search">
            <Search size={22} />
          </Link>
          
          <Link href="/account/wishlist" className="hidden sm:block hover:text-acid transition-colors p-1" title="Wishlist">
            <Heart size={22} />
          </Link>

          <Link href="/login" className="hidden sm:block hover:text-acid transition-colors p-1" title="Account Login">
            <User size={22} />
          </Link>

          <button
            onClick={openCart}
            className="relative bg-bone text-white p-2.5 rounded-full hover:bg-acid transition-colors cursor-pointer flex items-center justify-center shadow-xs"
            title="Open Cart"
          >
            <ShoppingCart size={20} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-acid text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
    </>
  );
}