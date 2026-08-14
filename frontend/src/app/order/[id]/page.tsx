"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Copy } from "lucide-react";
import Button from "@/components/ui/Button";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "FLQ-2026-89412";

  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 5);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-3xl mx-auto px-(--content-pad-x) py-(--section-pad-y) min-h-[80vh] flex flex-col items-center text-center">

      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-(--space-5)">
        <CheckCircle2 size={40} className="text-success" />
      </div>

      <h1 className="font-display tracking-[0.02em] text-success mb-(--space-2)">
        ORDER CONFIRMED.
      </h1>

      <p className="font-heading font-bold uppercase tracking-[0.06em] mb-(--space-5)">
        ORDER #{orderId}
      </p>

      <p className="font-body text-muted mb-(--space-6)">
        We&apos;ve received your order and are preparing it for shipment.<br />
        Estimated delivery: <span className="text-bone font-medium">{formatDate(deliveryStart)} – {formatDate(deliveryEnd)}</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-(--space-3) mb-(--space-8) w-full max-w-md">
        <Button variant="primary" className="flex-1">TRACK ORDER</Button>
        <Link href="/shop" className="flex-1 block">
          <Button variant="ghost" className="w-full">CONTINUE SHOPPING</Button>
        </Link>
      </div>

      <div>
        <h4 className="font-heading font-bold uppercase tracking-[0.06em] text-muted mb-(--space-3)">SHARE YOUR DROP</h4>
        <div className="flex gap-(--space-3) justify-center">
          <button className="w-12 h-12 rounded-full border border-border bg-white hover:border-acid hover:text-acid transition-colors duration-(--dur-fast) flex items-center justify-center font-heading font-bold cursor-pointer shadow-xs">
            X
          </button>
          <button className="w-12 h-12 rounded-full border border-border bg-white hover:border-acid hover:text-acid transition-colors duration-(--dur-fast) flex items-center justify-center font-heading font-bold cursor-pointer shadow-xs">
            IG
          </button>
          <button className="w-12 h-12 rounded-full border border-border bg-white hover:border-acid hover:text-acid transition-colors duration-(--dur-fast) flex items-center justify-center cursor-pointer shadow-xs">
            <Copy size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}
