"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const orderId = id ? id.toUpperCase() : "FLIQ-10842";

  return (
    <div className="max-w-xl mx-auto px-(--content-pad-x) pt-12 pb-20 font-body text-center">
      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-sm shadow-xs mb-8">
        <CheckCircle2 size={56} className="text-emerald-600 mx-auto mb-4" />
        <span className="font-mono text-xs font-bold text-emerald-800 uppercase block mb-1">PAYMENT SUCCESSFUL</span>
        <h1 className="font-display text-4xl sm:text-5xl text-emerald-950 uppercase tracking-tight mb-2">ORDER CONFIRMED!</h1>
        <p className="font-mono text-sm text-emerald-800 font-bold mb-4">ORDER ID: #{orderId}</p>
        <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
          Thank you for securing your FLIQ drop items! We have dispatched an order confirmation summary and digital tax invoice to your registered email.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/account/orders/${orderId}`}
          className="flex-1 bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors flex items-center justify-center gap-2"
        >
          TRACK SHIPMENT <Package size={16} />
        </Link>
        <Link
          href="/shop"
          className="flex-1 bg-white border border-zinc-300 text-bone font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:border-acid transition-colors flex items-center justify-center gap-2"
        >
          CONTINUE SHOPPING <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
