"use client";

import { Truck, RotateCcw, ShieldCheck, Clock, Globe } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">FULFILLMENT & POLICY</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">SHIPPING & RETURNS</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Shipping Policy */}
        <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-200 pb-4">
            <Truck size={28} className="text-acid" />
            <div>
              <h2 className="font-heading font-bold text-xl uppercase text-bone">SHIPPING POLICY</h2>
              <span className="font-mono text-xs text-muted">EXPRESS SHIPROCKET DISPATCH</span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
            <p>
              <strong>DOMESTIC (INDIA):</strong> Free express shipping on all prepaid orders over ₹1,999. Standard shipping flat rate ₹99 for orders under ₹1,999. Dispatch within 24–48 hours of drop order verification via BlueDart / Delhivery / Xpressbees.
            </p>
            <p>
              <strong>DELIVERY TIMELINES:</strong>
            </p>
            <ul className="list-disc pl-5 font-mono text-[11px] space-y-1">
              <li>Metro Cities: 2 – 4 Business Days</li>
              <li>Rest of India: 4 – 6 Business Days</li>
              <li>Express Priority (Select Tier 1): 24–48 Hours</li>
            </ul>
            <p>
              <strong>INTERNATIONAL SHIPPING:</strong> Flat rate $25 USD global express shipping via DHL Express. Import duties & local VAT are calculated at checkout where applicable.
            </p>
          </div>
        </div>

        {/* Returns & Exchange Policy */}
        <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-200 pb-4">
            <RotateCcw size={28} className="text-acid" />
            <div>
              <h2 className="font-heading font-bold text-xl uppercase text-bone">RETURNS & EXCHANGES</h2>
              <span className="font-mono text-xs text-muted">7-DAY HASSLE-FREE WINDOW</span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
            <p>
              <strong>7-DAY RETURN WINDOW:</strong> Unworn, unwashed garments with original FLIQ tags and security seals attached can be returned or exchanged within 7 days of order delivery.
            </p>
            <p>
              <strong>LIMITED DROP EXCHANGES:</strong> Due to limited batch sizes, size exchanges depend on stock availability. If your requested size is sold out, store credit or instant bank refund will be issued.
            </p>
            <p>
              <strong>HOW TO INITIATE A RETURN:</strong>
            </p>

            <ol className="list-decimal pl-5 font-mono text-[11px] space-y-1">
              <li>Go to Account &rarr; Returns or visit <a href="/account/returns/new" className="text-acid underline">Self-Service Returns</a></li>
              <li>Enter your Order ID and PIN code</li>
              <li>Schedule reverse doorstep pickup (Free for defective/wrong items)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
