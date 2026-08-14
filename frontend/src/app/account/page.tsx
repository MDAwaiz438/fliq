"use client";

import Link from "next/link";
import { ShoppingBag, MapPin, User, Heart, Sparkles, RotateCcw, Bell, LogOut, ChevronRight } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">MEMBER DASHBOARD</span>
          <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">WELCOME BACK, RAHUL</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-acid text-white font-mono text-xs font-bold px-3 py-1 uppercase rounded-xs flex items-center gap-1.5">
            <Sparkles size={14} /> FLIQ TIER: BLACK EDITION
          </span>
          <Link href="/login" className="text-xs font-heading font-bold uppercase text-muted hover:text-danger flex items-center gap-1">
            <LogOut size={14} /> LOGOUT
          </Link>
        </div>
      </div>

      {/* Account Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <Link href="/account/orders" className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs group">
          <div className="flex justify-between items-start mb-4">
            <ShoppingBag size={24} className="text-acid" />
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-acid transition-colors" />
          </div>
          <h2 className="font-heading font-bold text-lg uppercase text-bone mb-1">ORDER HISTORY</h2>
          <p className="text-xs text-zinc-500 font-mono">3 Active / Past Shipments</p>
        </Link>

        <Link href="/account/addresses" className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs group">
          <div className="flex justify-between items-start mb-4">
            <MapPin size={24} className="text-acid" />
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-acid transition-colors" />
          </div>
          <h2 className="font-heading font-bold text-lg uppercase text-bone mb-1">SAVED ADDRESSES</h2>
          <p className="text-xs text-zinc-500 font-mono">2 Delivery Locations</p>
        </Link>

        <Link href="/account/wishlist" className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs group">
          <div className="flex justify-between items-start mb-4">
            <Heart size={24} className="text-acid" />
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-acid transition-colors" />
          </div>
          <h2 className="font-heading font-bold text-lg uppercase text-bone mb-1">SAVED WISHLIST</h2>
          <p className="text-xs text-zinc-500 font-mono">4 Saved Atelier Items</p>
        </Link>

        <Link href="/account/loyalty" className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs group">
          <div className="flex justify-between items-start mb-4">
            <Sparkles size={24} className="text-acid" />
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-acid transition-colors" />
          </div>
          <h2 className="font-heading font-bold text-lg uppercase text-bone mb-1">FLIQ POINTS</h2>
          <p className="text-xs text-zinc-500 font-mono">1,450 Points (₹1,450 Value)</p>
        </Link>

        <Link href="/account/returns" className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs group">
          <div className="flex justify-between items-start mb-4">
            <RotateCcw size={24} className="text-acid" />
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-acid transition-colors" />
          </div>
          <h2 className="font-heading font-bold text-lg uppercase text-bone mb-1">RETURNS & EXCHANGES</h2>
          <p className="text-xs text-zinc-500 font-mono">0 Pending Returns</p>
        </Link>

        <Link href="/account/profile" className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs group">
          <div className="flex justify-between items-start mb-4">
            <User size={24} className="text-acid" />
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-acid transition-colors" />
          </div>
          <h2 className="font-heading font-bold text-lg uppercase text-bone mb-1">PROFILE & SECURITY</h2>
          <p className="text-xs text-zinc-500 font-mono">Phone, Password & Auth</p>
        </Link>
      </div>

      {/* Recent Order Preview */}
      <div className="bg-obsidian border border-zinc-200 p-6 rounded-sm">
        <h3 className="font-heading font-bold text-base uppercase text-bone mb-4">MOST RECENT SHIPMENT</h3>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-zinc-200 rounded-sm">
          <div>
            <span className="font-mono text-xs font-bold text-acid">ORDER #FLIQ-10842</span>
            <h4 className="font-heading font-bold text-sm uppercase text-bone">Distortion Oversized Hoodie (Drop 03)</h4>
            <span className="font-mono text-[11px] text-zinc-500">PLACED ON AUG 12, 2026 • ₹3,499</span>
          </div>

          <Link href="/account/orders/FLIQ-10842" className="bg-bone text-white font-heading font-bold text-xs uppercase px-4 py-2 hover:bg-acid transition-colors">
            TRACK ORDER &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
