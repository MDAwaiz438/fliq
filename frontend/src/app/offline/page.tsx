"use client";

import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="max-w-md mx-auto px-(--content-pad-x) pt-20 pb-20 font-body text-center">
      <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
        <WifiOff size={56} className="text-zinc-400 mx-auto mb-4" />
        <span className="font-mono text-xs font-bold text-zinc-500 uppercase block mb-1">PWA OFFLINE MODE</span>
        <h1 className="font-display text-4xl text-bone uppercase tracking-tight mb-2">NO INTERNET CONNECTION</h1>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          You are currently offline. Check your mobile network or Wi-Fi connectivity to view real-time drop stock.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          TRY RECONNECTING <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}