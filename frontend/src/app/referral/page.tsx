"use client";

import { useState } from "react";
import { Gift, Copy, Check, Users, Sparkles } from "lucide-react";

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://fliqstreetwear.com/r/FLIQ-AFREEN2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">REWARD PROGRAM</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">REFER A FRIEND, GET ₹500</h1>
      </div>

      <div className="bg-bone text-white p-8 sm:p-12 rounded-sm mb-12 relative overflow-hidden grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="bg-acid text-white font-mono text-xs font-bold px-3 py-1 uppercase rounded-xs mb-3 inline-block">
            GIVE ₹500, GET ₹500
          </span>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider mb-4">
            SHARE THE ATELIER CRAFT
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed mb-6">
            Invite your friends to FLIQ. When they place their first drop order of ₹2,000 or more using your personal referral link, they get ₹500 off, and you receive ₹500 store credit immediately.
          </p>

          {/* Link Copy Box */}
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-sm p-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="bg-transparent text-xs font-mono text-zinc-300 flex-1 px-2 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="bg-acid text-white font-heading font-bold text-xs uppercase px-4 py-2 hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "COPIED!" : "COPY LINK"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm text-center">
            <Users size={32} className="text-acid mx-auto mb-2" />
            <span className="font-mono text-2xl font-bold block text-white">12</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">FRIENDS REFERRED</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm text-center">
            <Sparkles size={32} className="text-acid mx-auto mb-2" />
            <span className="font-mono text-2xl font-bold block text-white">₹6,000</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">CREDIT EARNED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
