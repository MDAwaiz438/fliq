"use client";

import { useState } from "react";
import { Cookie, Check } from "lucide-react";

export default function CookiesPage() {
  const [essential, setEssential] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">COOKIE PREFERENCES</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">COOKIE POLICY</h1>
        <span className="font-mono text-xs text-muted block mt-2">LAST UPDATED: AUGUST 14, 2026</span>
      </div>

      <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs mb-8">
        <h2 className="font-heading font-bold text-lg uppercase text-bone mb-4">MANAGE COOKIE SETTINGS</h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-obsidian border border-zinc-200 rounded-sm">
            <div>
              <h3 className="font-heading font-bold text-sm uppercase text-bone">ESSENTIAL COOKIES</h3>
              <p className="text-[11px] text-zinc-500">Required for cart state, session auth, and security.</p>
            </div>
            <span className="font-mono text-xs font-bold text-acid">ALWAYS ACTIVE</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-obsidian border border-zinc-200 rounded-sm">
            <div>
              <h3 className="font-heading font-bold text-sm uppercase text-bone">ANALYTICS & PERFORMANCE</h3>
              <p className="text-[11px] text-zinc-500">Anonymous traffic stats to optimize site performance.</p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="w-4 h-4 accent-acid cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-obsidian border border-zinc-200 rounded-sm">
            <div>
              <h3 className="font-heading font-bold text-sm uppercase text-bone">MARKETING & CAMPAIGNS</h3>
              <p className="text-[11px] text-zinc-500">Tailored drop teasers and retargeting ads.</p>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="w-4 h-4 accent-acid cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={() => setSaved(true)}
          className="bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-acid transition-colors cursor-pointer flex items-center gap-2"
        >
          {saved ? "PREFERENCES SAVED!" : "SAVE PREFERENCES"} <Check size={16} />
        </button>
      </div>
    </div>
  );
}
