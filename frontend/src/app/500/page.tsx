"use client";

import Link from "next/link";
import { ServerCrash, RefreshCw } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="max-w-md mx-auto px-(--content-pad-x) pt-20 pb-20 font-body text-center">
      <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
        <ServerCrash size={56} className="text-acid mx-auto mb-4" />
        <span className="font-mono text-xs font-bold text-acid uppercase block mb-1">500 INTERNAL SERVER ERROR</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight mb-2">SYSTEM FAULT</h1>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          Our servers encountered an unexpected exception while processing this request. Our engineering team has been notified.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          RELOAD PAGE <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}
