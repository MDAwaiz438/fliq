"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Sparkles, MapPin, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      {/* Header */}
      <div className="border-b border-bone pb-6 mb-12">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">BRAND MANIFESTO & ATELIER</span>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tight text-bone uppercase">RAW. EDGE. NOW.</h1>
        <p className="text-muted text-sm max-w-2xl mt-2">
          FLIQ is an independent streetwear atelier engineered in India. We design limited drop garments defined by heavy custom textiles, boxy proportions, and raw-edge precision.
        </p>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <span className="bg-acid/10 text-acid font-mono text-xs font-bold px-3 py-1 uppercase rounded-xs">
            FOUNDED 2026 • MUMBAI ATELIER
          </span>

          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-bone">
            REJECTING MASS PRODUCTION. EMBRACING BATCH CRAFT.
          </h2>

          <p className="text-zinc-600 text-sm leading-relaxed">
            Every garment released under the FLIQ label begins with custom fabric development. We reject thin poly-blends and generic stock blanks. Instead, we mill 450GSM loopback cottons, 280GSM combed jerseys, and Japanese selvedge denims engineered for longevity and heavy drape.
          </p>

          <p className="text-zinc-600 text-sm leading-relaxed">
            Our drops are limited to strict batch numbers. Once a capsule sells out, the patterns are locked into our permanent digital archive.
          </p>

          <div className="pt-4 border-t border-zinc-200 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="block font-mono text-2xl font-bold text-bone">450 GSM</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">HEAVY COTTON</span>
            </div>
            <div>
              <span className="block font-mono text-2xl font-bold text-acid">100%</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">CUSTOM PATTERNS</span>
            </div>
            <div>
              <span className="block font-mono text-2xl font-bold text-bone">250</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">UNITS PER DROP</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-4/3 sm:aspect-square bg-obsidian rounded-sm overflow-hidden border border-zinc-200 shadow-md">
          <Image
            src="/images/product_distortion.png"
            alt="FLIQ Atelier Craft"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Pillars */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-xs">
          <ShieldCheck size={28} className="text-acid mb-4" />
          <h3 className="font-heading font-bold text-lg uppercase text-bone mb-2">CUSTOM MILLED FABRICS</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Heavyweight textiles specifically milled for structure, minimal shrinkage, and superior tactical feel.
          </p>
        </div>

        <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-xs">
          <Award size={28} className="text-acid mb-4" />
          <h3 className="font-heading font-bold text-lg uppercase text-bone mb-2">RAW EDGE ATELIER</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Exposed seam work, distressed finishes, and asymmetrical industrial cuts hand-finished in our studio.
          </p>
        </div>

        <div className="bg-white p-6 border border-zinc-200 rounded-sm shadow-xs">
          <Sparkles size={28} className="text-acid mb-4" />
          <h3 className="font-heading font-bold text-lg uppercase text-bone mb-2">NO RE-PRINTS POLICY</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            When a drop is gone, it is archived forever. Collectors hold true limited pieces that maintain long-term value.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-bone text-white p-8 sm:p-12 rounded-sm text-center">
        <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider mb-4">EXPLORE THE LATEST CAPSULE</h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6">
          Discover our current available inventory before the next drop locks into the archive.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-acid text-white font-heading font-bold text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-blue-700 transition-colors"
        >
          SHOP ACTIVE CATALOG <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
