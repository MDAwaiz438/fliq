"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Award, Gift } from "lucide-react";

export default function AccountLoyaltyPage() {
  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/account" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO DASHBOARD
      </Link>

      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">MEMBER REWARDS</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">FLIQ REWARDS & POINTS</h1>
      </div>

      {/* Points Banner */}
      <div className="bg-bone text-white p-8 sm:p-12 rounded-sm mb-10 relative overflow-hidden grid md:grid-cols-2 gap-8 items-center border border-zinc-800">
        <div>
          <span className="bg-gold text-white font-mono text-[10px] font-bold px-3 py-1 uppercase rounded-xs mb-3 inline-block">
            TIER: BLACK EDITION MEMBER
          </span>
          <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider mb-2">
            1,450 POINTS
          </h2>
          <p className="text-zinc-400 font-mono text-xs mb-4">EQUIVALENT TO ₹1,450 STORE CREDIT</p>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Earn 1 FLIQ Point for every ₹10 spent on drop purchases. Points never expire and can be applied directly at checkout.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm space-y-3 font-mono text-xs">
          <div className="flex justify-between pb-2 border-b border-zinc-800">
            <span className="text-zinc-400">NEXT TIER UNLOCK:</span>
            <span className="text-gold font-bold">ATELIER ELITE</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gold h-full w-3/4" />
          </div>
          <span className="text-[11px] text-zinc-400 block text-right">550 POINTS TO GO</span>
        </div>
      </div>

      {/* Rewards History */}
      <div className="bg-white border border-zinc-200 p-6 rounded-sm">
        <h3 className="font-heading font-bold text-base uppercase text-bone mb-4 border-b border-zinc-200 pb-2">POINTS ACTIVITY LOG</h3>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <div>
              <span className="text-bone font-bold">EARNED FROM ORDER #FLIQ-10842</span>
              <span className="text-zinc-400 block text-[10px]">AUG 12, 2026</span>
            </div>
            <span className="text-acid font-bold">+350 PTS</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <div>
              <span className="text-bone font-bold">FRIEND REFERRAL BONUS (RAHUL S.)</span>
              <span className="text-zinc-400 block text-[10px]">JULY 28, 2026</span>
            </div>
            <span className="text-acid font-bold">+500 PTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
