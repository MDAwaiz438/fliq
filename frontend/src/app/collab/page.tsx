"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CollabPage() {
  const collabs = [
    {
      id: "collab-01",
      slug: "fliq-x-tokyo-underground",
      title: "FLIQ × TOKYO UNDERGROUND",
      season: "AUTUMN / WINTER 2026",
      subtitle: "Neotokyo Graphic Heavyweight Capsule",
      description: "A joint release with Tokyo-based visual artist collective NekoLab, featuring cyberpunk typology prints and waterproof 3-layer outerwear.",
      image: "/images/product_distortion.png",
      tag: "FEATURED",
    },
    {
      id: "collab-02",
      slug: "fliq-x-raw-distillery",
      title: "FLIQ × RAW DISTILLERY",
      season: "SUMMER 2026",
      subtitle: "Industrial Denim & Heavy Cotton Wash",
      description: "Hand-dyed 14oz Japanese selvedge denim jacket and distressed heavyweight tees.",
      image: "/images/shirt_viscose.png",
      tag: "ARCHIVED",
    },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      {/* Header */}
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">ATELIER COLLABORATIONS</span>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tight text-bone uppercase">CREATIVE PARTNERSHIPS</h1>
        <p className="text-muted text-sm max-w-2xl mt-2">
          FLIQ partners with international artists, typographers, and industrial designers to craft bespoke sub-cultural capsules.
        </p>
      </div>

      <div className="space-y-12">
        {collabs.map((collab) => (
          <div key={collab.id} className="bg-white border border-zinc-200 rounded-sm overflow-hidden grid md:grid-cols-2 hover:border-acid transition-colors shadow-xs">
            <div className="relative aspect-4/3 md:aspect-auto bg-obsidian">
              <Image
                src={collab.image}
                alt={collab.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-4 left-4 bg-bone text-white font-mono text-[10px] font-bold px-2.5 py-1 uppercase rounded-xs">
                {collab.tag}
              </span>
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-acid uppercase block mb-1">{collab.season}</span>
                <h2 className="font-display text-3xl sm:text-4xl uppercase text-bone mb-2 tracking-tight">{collab.title}</h2>
                <h3 className="font-heading text-lg font-bold text-zinc-700 uppercase mb-4">{collab.subtitle}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6">{collab.description}</p>
              </div>

              <Link
                href={`/collab/${collab.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3 px-6 hover:bg-acid transition-colors self-start"
              >
                VIEW COLLAB STORY & PRODUCTS <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
