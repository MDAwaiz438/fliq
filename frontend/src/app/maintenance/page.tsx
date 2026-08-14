"use client";

import { Clock, ShieldAlert } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-(--content-pad-x) font-body text-center">
      <div className="max-w-lg bg-bone text-white p-8 sm:p-12 rounded-sm border border-zinc-800 shadow-2xl">
        <ShieldAlert size={56} className="text-acid mx-auto mb-4 animate-bounce" />
        <span className="font-mono text-xs font-bold text-acid uppercase block mb-1">SYSTEM MAINTENANCE</span>
        <h1 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-tight mb-2">PREPARING NEXT DROP</h1>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          The FLIQ storefront is currently locked while our engineering team stages DROP 04: CYBER MONOLITH. The site will reopen at 18:00 IST.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-sm font-mono text-xs text-zinc-300">
          STATUS: LAUNCH CONTROL STAGING
        </div>
      </div>
    </div>
  );
}
