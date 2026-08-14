"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Truck } from "lucide-react";

export default function AccountOrdersPage() {
  const orders = [
    { id: "FLIQ-10842", date: "AUG 12, 2026", items: "Distortion Oversized Hoodie (Drop 03)", total: 3499, status: "IN_TRANSIT", courier: "BlueDart" },
    { id: "FLIQ-10492", date: "MAY 18, 2026", items: "100% Viscose Embroidered Box Fit Shirt", total: 1099, status: "DELIVERED", courier: "Delhivery" },
    { id: "FLIQ-10110", date: "FEB 04, 2026", items: "Vintage Maroon Acid Wash Tank Top", total: 1199, status: "DELIVERED", courier: "Xpressbees" },
  ];

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/account" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO DASHBOARD
      </Link>

      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">CUSTOMER PURCHASES</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">ORDER HISTORY</h1>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.id} className="bg-white border border-zinc-200 p-6 rounded-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-acid transition-colors shadow-xs">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono font-bold text-sm text-acid">{ord.id}</span>
                <span className="font-mono text-xs text-zinc-400">• {ord.date}</span>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 uppercase rounded-xs ${ord.status === 'IN_TRANSIT' ? 'bg-acid text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  {ord.status}
                </span>
              </div>
              <h3 className="font-heading font-bold text-base uppercase text-bone">{ord.items}</h3>
              <p className="font-mono text-xs text-zinc-500 mt-1">TOTAL PAID: ₹{ord.total.toLocaleString("en-IN")}</p>
            </div>

            <Link
              href={`/account/orders/${ord.id}`}
              className="bg-bone text-white font-heading font-bold text-xs uppercase px-5 py-2.5 hover:bg-acid transition-colors self-start md:self-auto"
            >
              VIEW SHIPMENT DETAILS &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
