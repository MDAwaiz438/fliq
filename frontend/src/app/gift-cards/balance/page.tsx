"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Search, ArrowLeft } from "lucide-react";

export default function GiftCardBalancePage() {
  const [code, setCode] = useState("");
  const [balanceResult, setBalanceResult] = useState<number | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setBalanceResult(2500);
  };

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/gift-cards" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO GIFT CARDS
      </Link>

      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">BALANCE CHECKER</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">CHECK GIFT CARD BALANCE</h1>
      </div>

      <div className="max-w-md mx-auto bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">16-DIGIT GIFT CARD CODE *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. FLIQ-9821-4820-1092"
              className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-mono text-bone focus:outline-none focus:border-acid"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            VERIFY BALANCE <Search size={16} />
          </button>
        </form>

        {balanceResult !== null && (
          <div className="mt-6 pt-6 border-t border-zinc-200 text-center bg-obsidian p-4 rounded-sm">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">REMAINING UNUSED BALANCE</span>
            <span className="font-mono text-3xl font-bold text-acid">₹{balanceResult.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
