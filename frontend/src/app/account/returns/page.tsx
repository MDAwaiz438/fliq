"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Plus } from "lucide-react";

export default function AccountReturnsPage() {
  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <Link href="/account" className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider text-muted hover:text-acid mb-6">
        <ArrowLeft size={16} /> BACK TO DASHBOARD
      </Link>

      <div className="border-b border-bone pb-6 mb-8 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">SELF-SERVICE PORTAL</span>
          <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">RETURNS & EXCHANGES</h1>
        </div>

        <Link href="/account/returns/new" className="bg-bone text-white font-heading font-bold text-xs uppercase px-5 py-2.5 hover:bg-acid transition-colors flex items-center gap-2">
          <Plus size={16} /> INITIATE RETURN
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 p-12 text-center rounded-sm">
        <RotateCcw size={40} className="text-zinc-300 mx-auto mb-3" />
        <h3 className="font-heading font-bold text-xl uppercase text-bone mb-2">NO ACTIVE RETURN REQUESTS</h3>
        <p className="text-xs text-zinc-500 mb-6 max-w-sm mx-auto">
          Need to exchange a size or return a garment? You can initiate a doorstep pickup request within 7 days of order delivery.
        </p>
        <Link href="/account/returns/new" className="bg-acid text-white font-heading font-bold text-xs uppercase px-6 py-3 hover:bg-blue-700 transition-colors">
          REQUEST NEW RETURN
        </Link>
      </div>
    </div>
  );
}
