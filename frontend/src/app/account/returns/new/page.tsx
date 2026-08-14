"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";

export default function NewReturnPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("SIZE_TOO_LARGE");

  return (
    <div className="max-w-xl mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/account/returns" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO RETURNS
      </Link>

      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">REVERSE LOGISTICS</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">NEW RETURN REQUEST</h1>
      </div>

      <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm text-center">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
            <h3 className="font-heading font-bold text-lg uppercase text-emerald-900 mb-1">RETURN PICKUP SCHEDULED</h3>
            <p className="text-xs text-emerald-700 font-body mb-4">
              Our courier partner (Shiprocket) will collect the parcel from your saved default address within 24–48 hours.
            </p>
            <Link href="/account/orders" className="bg-bone text-white font-heading font-bold text-xs uppercase px-6 py-2.5 hover:bg-acid transition-colors">
              BACK TO ORDERS
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">SELECT ORDER FOR RETURN *</label>
              <select className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-mono text-bone focus:outline-none focus:border-acid">
                <option value="FLIQ-10842">#FLIQ-10842 — Distortion Oversized Hoodie (₹3,499)</option>
                <option value="FLIQ-10492">#FLIQ-10492 — Viscose Embroidered Box Fit Shirt (₹1,099)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">REASON FOR RETURN / EXCHANGE *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
              >
                <option value="SIZE_TOO_LARGE">Size Too Large (Need Exchange)</option>
                <option value="SIZE_TOO_SMALL">Size Too Small (Need Exchange)</option>
                <option value="DEFECTIVE">Defective or Damaged Garment</option>
                <option value="CHANGED_MIND">Changed Mind / Store Credit Refund</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">ADDITIONAL NOTES (OPTIONAL)</label>
              <textarea
                rows={3}
                placeholder="Details about fit or defect..."
                className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-acid text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              CONFIRM & SCHEDULE PICKUP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
