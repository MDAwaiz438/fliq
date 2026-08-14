"use client";

import { MapPin, Phone, Globe } from "lucide-react";

export default function StockistsPage() {
  const stockists = [
    { city: "MUMBAI", store: "FLIQ ATELIER FLAGSHIP", address: "Building 4B, Lower Parel Industrial Estate, Mumbai 400013", hours: "11:00 AM - 8:00 PM IST" },
    { city: "NEW DELHI", store: "THE CONCEPT LAB", address: "DLF Emporio, Vasant Kunj, New Delhi 110070", hours: "11:00 AM - 9:00 PM IST" },
    { city: "BENGALURU", store: "REVOLVER BOUTIQUE", address: "Indiranagar 100ft Road, Bengaluru 560038", hours: "11:30 AM - 8:30 PM IST" },
    { city: "TOKYO", store: "NEOKYO STREET LAB", address: "Jingumae 4-Chome, Shibuya-ku, Tokyo 150-0001", hours: "12:00 PM - 8:00 PM JST" },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">STORE LOCATOR</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">OFFICIAL STOCKISTS & FLAGSHIP</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {stockists.map((st, idx) => (
          <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-sm hover:border-acid transition-colors shadow-xs">
            <span className="font-mono text-xs font-bold text-acid uppercase block mb-1">{st.city}</span>
            <h2 className="font-heading font-bold text-xl uppercase text-bone mb-2">{st.store}</h2>
            <p className="text-xs text-zinc-600 mb-3 flex items-start gap-2">
              <MapPin size={16} className="text-zinc-400 shrink-0 mt-0.5" />
              <span>{st.address}</span>
            </p>
            <span className="font-mono text-[11px] text-muted block border-t border-zinc-100 pt-3">HOURS: {st.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
