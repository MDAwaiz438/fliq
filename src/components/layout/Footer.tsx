"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/checkout') return null;
  return (
    <footer className="w-full bg-(--bg)">
      <div className="flex flex-col lg:flex-row border-b border-(--border)">
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-(--border) flex flex-col justify-center">
          <h2 className="font-(family-name:--font-display) text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-4 text-(--text-primary)">
            Join The <span className="text-(--accent)">Drop List</span>
          </h2>
          <p className="uppercase font-bold text-xs md:text-sm tracking-widest text-(--text-muted) mb-6 md:mb-8">Exclusive access to drops and early releases.</p>
          <div className="flex w-full max-w-full md:max-w-md">
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="flex-1 bg-transparent border border-r-0 border-(--border) px-4 py-3 uppercase font-bold text-xs md:text-sm outline-none text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent) transition-colors min-w-0"
            />
            <button className="bg-(--accent) text-(--bg) px-4 md:px-6 py-3 uppercase font-bold text-xs md:text-sm border border-(--accent) hover:bg-transparent hover:text-(--accent) transition-colors duration-200 shrink-0">
              Submit
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col gap-4">
              <h4 className="font-(family-name:--font-display) font-bold uppercase tracking-widest text-xs md:text-sm mb-1 md:mb-2 text-(--accent)">Shop</h4>
              <Link href="/products" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">All Products</Link>
              <Link href="/products" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">Apparel</Link>
              <Link href="/products" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">Footwear</Link>
              <Link href="/products" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">Accessories</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-(family-name:--font-display) font-bold uppercase tracking-widest text-xs md:text-sm mb-1 md:mb-2 text-(--accent)">Support</h4>
              <Link href="/about" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">FAQ</Link>
              <Link href="/terms" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">Privacy Policy</Link>
              <Link href="/about" className="text-xs md:text-sm font-bold uppercase text-(--text-muted) hover:text-(--accent) transition-colors">Contact</Link>
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-(--border)">
            <span className="font-(family-name:--font-display) text-2xl font-bold tracking-tighter text-(--accent)">FLIQ</span>
            <span className="text-[10px] md:text-xs font-bold uppercase text-(--text-muted)">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
