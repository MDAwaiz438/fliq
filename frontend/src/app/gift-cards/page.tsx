"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, CreditCard, Send, CheckCircle2 } from "lucide-react";

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(2500);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [purchased, setPurchased] = useState(false);

  const amounts = [1000, 2500, 5000, 10000];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">DIGITAL GIFTING</span>
          <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">FLIQ DIGITAL GIFT CARD</h1>
        </div>

        <Link href="/gift-cards/balance" className="font-heading font-bold text-xs uppercase tracking-wider text-acid hover:underline">
          CHECK EXISTING GIFT CARD BALANCE &rarr;
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Visual Gift Card Preview */}
        <div className="bg-bone text-white p-8 sm:p-10 rounded-sm shadow-2xl relative overflow-hidden aspect-16/10 flex flex-col justify-between border border-zinc-800">
          <div className="flex justify-between items-start">
            <span className="font-display text-3xl tracking-wider text-white">FLIQ</span>
            <Gift size={32} className="text-acid" />
          </div>

          <div>
            <span className="font-mono text-xs text-zinc-400 block mb-1 uppercase">DIGITAL VOUCHER VALUE</span>
            <span className="font-mono text-4xl sm:text-5xl font-bold text-acid">₹{amount.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-end pt-4 border-t border-zinc-800 font-mono text-[10px] text-zinc-400">
            <span>FLIQ ATELIER GIFT CARD</span>
            <span>NO EXPIRY DATE</span>
          </div>
        </div>

        {/* Purchase Options */}
        <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
          <h2 className="font-heading font-bold text-xl uppercase text-bone mb-6">SELECT DENOMINATION</h2>

          {purchased ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm text-center">
              <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-lg uppercase text-emerald-900 mb-1">GIFT CARD GENERATED</h3>
              <p className="text-xs text-emerald-700 font-mono">
                Code sent to {recipientEmail || "recipient@example.com"}
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setPurchased(true); }} className="space-y-6">
              <div className="grid grid-cols-4 gap-3">
                {amounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-3 font-mono font-bold text-xs rounded-xs border transition-colors cursor-pointer ${
                      amount === val ? "bg-bone text-white border-bone" : "bg-obsidian border-zinc-200 text-bone hover:border-acid"
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">RECIPIENT EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. friend@example.com"
                  className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-acid text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                BUY GIFT CARD FOR ₹{amount.toLocaleString("en-IN")} <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
