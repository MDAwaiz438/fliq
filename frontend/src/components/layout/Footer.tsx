"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-obsidian pt-16 pb-8 border-t border-zinc-200 text-bone font-body">
      <div className="max-w-(--content-max) mx-auto px-(--content-pad-x)">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">

          <div className="md:w-1/3">
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/logo.svg"
                alt="FLIQ Logo"
                width={200}
                height={60}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>
            <p className="font-heading font-semibold uppercase tracking-widest text-xs text-zinc-500">
              RAW. EDGE. NOW.
            </p>
            <p className="text-xs font-body text-zinc-500 mt-3 leading-relaxed max-w-xs">
              FLIQ Streetwear &amp; Atelier — Limited drop culture engineered in India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:w-2/3">
            <div>
              <h4 className="font-heading font-bold uppercase mb-3 tracking-wider text-xs text-bone">SHOP</h4>
              <ul className="flex flex-col gap-2 font-body text-xs text-zinc-600">
                <li><Link href="/drops" className="hover:text-acid transition-colors">Drops</Link></li>
                <li><Link href="/shop" className="hover:text-acid transition-colors">All Gear</Link></li>
                <li><Link href="/drops" className="hover:text-acid transition-colors">Archive</Link></li>
                <li><Link href="/collab" className="hover:text-acid transition-colors">Collab</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold uppercase mb-3 tracking-wider text-xs text-bone">COMPANY</h4>
              <ul className="flex flex-col gap-2 font-body text-xs text-zinc-600">
                <li><Link href="/about" className="hover:text-acid transition-colors">About</Link></li>
                <li><Link href="/lookbook" className="hover:text-acid transition-colors">Lookbook</Link></li>
                <li><Link href="/careers" className="hover:text-acid transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-acid transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold uppercase mb-3 tracking-wider text-xs text-bone">SUPPORT</h4>
              <ul className="flex flex-col gap-2 font-body text-xs text-zinc-600">
                <li><Link href="/shipping-returns" className="hover:text-acid transition-colors">Shipping &amp; Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-acid transition-colors">Size Guide</Link></li>
                <li><Link href="/track-order" className="hover:text-acid transition-colors">Track Order</Link></li>
                <li><Link href="/contact" className="hover:text-acid transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold uppercase mb-3 tracking-wider text-xs text-bone">LEGAL</h4>
              <ul className="flex flex-col gap-2 font-body text-xs text-zinc-600">
                <li><Link href="/terms" className="hover:text-acid transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-acid transition-colors">Privacy</Link></li>
                <li><Link href="/cookies" className="hover:text-acid transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-zinc-200 text-xs font-mono text-zinc-500 gap-4">
          <p>&copy; 2026 FLIQ STREETWEAR. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <span className="hover:text-acid cursor-pointer">INSTAGRAM</span>
            <span className="hover:text-acid cursor-pointer">TWITTER</span>
            <span className="hover:text-acid cursor-pointer">DISCORD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
