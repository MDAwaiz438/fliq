"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function PaymentFailedPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const orderId = id ? id.toUpperCase() : "FLIQ-10842";

  return (
    <div className="max-w-xl mx-auto px-(--content-pad-x) pt-12 pb-20 font-body text-center">
      <div className="bg-rose-50 border border-rose-200 p-8 rounded-sm shadow-xs mb-8">
        <AlertTriangle size={56} className="text-rose-600 mx-auto mb-4" />
        <span className="font-mono text-xs font-bold text-rose-800 uppercase block mb-1">TRANSACTION DECLINED</span>
        <h1 className="font-display text-4xl sm:text-5xl text-rose-950 uppercase tracking-tight mb-2">PAYMENT FAILED</h1>
        <p className="font-mono text-sm text-rose-800 font-bold mb-4">ORDER ID: #{orderId}</p>
        <p className="text-xs text-rose-700 leading-relaxed max-w-md mx-auto">
          Your payment attempt was declined by the card issuing bank or UPI gateway. Don't worry — your cart items are reserved for 15 minutes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/checkout"
          className="flex-1 bg-acid text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          RETRY PAYMENT NOW <RefreshCw size={16} />
        </Link>
        <Link
          href="/cart"
          className="flex-1 bg-white border border-zinc-300 text-bone font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:border-acid transition-colors flex items-center justify-center gap-2"
        >
          RETURN TO CART <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
}
