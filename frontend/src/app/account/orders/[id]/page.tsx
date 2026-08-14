"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, Receipt } from "lucide-react";

export default function AccountOrderDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const orderId = id ? id.toUpperCase() : "FLIQ-10842";

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/account/orders" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO ORDERS
      </Link>

      <div className="border-b border-bone pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">SHIPMENT TRACKER</span>
          <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">ORDER #{orderId}</h1>
        </div>

        <span className="bg-acid text-white font-mono text-xs font-bold px-3 py-1.5 uppercase rounded-xs">
          STATUS: IN TRANSIT (BLUEDART AWB-84920194)
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-xs">
            <h2 className="font-heading font-bold text-lg uppercase text-bone mb-4 border-b border-zinc-200 pb-2">ORDER GARMENTS</h2>
            <div className="flex items-center justify-between py-3 border-b border-zinc-100">
              <div>
                <h3 className="font-heading font-bold text-base uppercase text-bone">Distortion Oversized Hoodie (Drop 03)</h3>
                <p className="font-mono text-xs text-zinc-500">SIZE: L • QTY: 1 • SKU: FLIQ-AW26-HOOD-03</p>
              </div>
              <span className="font-mono font-bold text-sm text-bone">₹3,499</span>
            </div>

            <div className="pt-4 flex justify-between items-center font-mono text-xs text-zinc-600">
              <span>SUBTOTAL</span>
              <span>₹3,499</span>
            </div>
            <div className="py-1 flex justify-between items-center font-mono text-xs text-zinc-600">
              <span>EXPRESS SHIPPING</span>
              <span className="text-acid font-bold">FREE</span>
            </div>
            <div className="pt-3 border-t border-zinc-200 flex justify-between items-center font-mono font-bold text-base text-bone">
              <span>TOTAL PAID</span>
              <span>₹3,499</span>
            </div>
          </div>
        </div>

        {/* Right Column: Address & Timeline */}
        <div className="space-y-6">
          <div className="bg-obsidian border border-zinc-200 p-6 rounded-sm">
            <h3 className="font-heading font-bold text-sm uppercase text-bone mb-3 flex items-center gap-1.5">
              <MapPin size={16} className="text-acid" /> DELIVERY ADDRESS
            </h3>
            <div className="text-xs text-zinc-600 leading-relaxed font-body">
              <strong className="text-bone">Rahul Sharma</strong><br />
              Apartment 402, Sea Crest Towers<br />
              Worli Sea Face, Mumbai 400018<br />
              Maharashtra, India
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-sm">
            <h3 className="font-heading font-bold text-sm uppercase text-bone mb-3">ACTION DESK</h3>
            <Link
              href="/account/returns/new"
              className="block w-full text-center bg-obsidian border border-zinc-300 text-bone font-heading font-bold text-xs uppercase py-2.5 hover:border-acid hover:text-acid transition-colors"
            >
              REQUEST RETURN OR EXCHANGE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
