"use client";

import Link from "next/link";
import Image from "next/image";
import { Camera, ArrowRight } from "lucide-react";

export default function LookbookPage() {
  const lookbooks = [
    {
      id: "lookbook-03",
      slug: "autumn-winter-26-distortion",
      title: "AW26 — DISTORTION ARCHITECTURE",
      season: "AUTUMN / WINTER 2026",
      photographer: "Kenji Sato",
      location: "Shibuya Underground Atelier",
      image: "/images/product_distortion.png",
      shots: 14,
    },
    {
      id: "lookbook-02",
      slug: "summer-26-acid-wash",
      title: "SS26 — ACID & RAW SILHOUETTES",
      season: "SPRING / SUMMER 2026",
      photographer: "Elena Vance",
      location: "Berlin Concrete Park",
      image: "/images/tank_maroon_1.jpg",
      shots: 18,
    },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">EDITORIAL GALLERIES</span>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tight text-bone uppercase">SEASONAL LOOKBOOKS</h1>
        <p className="text-muted text-sm max-w-2xl mt-2">
          Visual documentation of FLIQ silhouettes in high-contrast urban landscapes across Tokyo, Berlin, and Mumbai.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {lookbooks.map((lb) => (
          <div key={lb.id} className="bg-white border border-zinc-200 rounded-sm overflow-hidden group hover:border-acid transition-colors shadow-xs">
            <div className="relative aspect-4/3 bg-obsidian overflow-hidden">
              <Image
                src={lb.image}
                alt={lb.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute bottom-4 left-4 bg-bone text-white font-mono text-[10px] font-bold px-2.5 py-1 uppercase rounded-xs">
                {lb.shots} EDITORIAL SHOTS
              </span>
            </div>

            <div className="p-6">
              <span className="font-mono text-xs font-bold text-acid uppercase block mb-1">{lb.season}</span>
              <h2 className="font-heading text-xl font-bold uppercase text-bone mb-2">{lb.title}</h2>
              <p className="text-xs text-zinc-500 font-mono mb-4">
                PHOTOGRAPHY BY {lb.photographer.toUpperCase()} • {lb.location.toUpperCase()}
              </p>

              <Link
                href={`/lookbook/${lb.slug}`}
                className="inline-flex items-center gap-1.5 font-heading font-bold text-xs uppercase tracking-wider text-bone hover:text-acid"
              >
                VIEW FULL LOOKBOOK GALLERY &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
