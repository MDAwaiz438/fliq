"use client";

import { Download, ExternalLink } from "lucide-react";

export default function PressPage() {
  const press = [
    { outlet: "VOGUE INDIA", title: "FLIQ: The Mumbai Atelier Redefining Indian Streetwear Batch Culture", date: "JULY 2026" },
    { outlet: "GQ MAGAZINE", title: "Heavyweight 450GSM Loopback Cotton & The Rise of Industrial Silhouettes", date: "MAY 2026" },
    { outlet: "COMPLEX", title: "Top 10 Emerging Global Streetwear Labels to Watch in 2026", date: "MARCH 2026" },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">PRESS & MEDIA</span>
          <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">EDITORIAL COVERAGE</h1>
        </div>

        <button className="bg-bone text-white font-heading font-bold text-xs uppercase px-5 py-2.5 hover:bg-acid transition-colors flex items-center gap-2 cursor-pointer">
          DOWNLOAD MEDIA KIT (ZIP, 45MB) <Download size={14} />
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {press.map((item, idx) => (
          <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs">
            <span className="font-mono text-xs font-bold text-acid block mb-1">{item.outlet} • {item.date}</span>
            <h2 className="font-heading font-bold text-xl uppercase text-bone mb-3">{item.title}</h2>
            <a href="#" className="font-heading font-bold text-xs uppercase text-zinc-500 hover:text-acid inline-flex items-center gap-1">
              READ FULL ARTICLE <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
