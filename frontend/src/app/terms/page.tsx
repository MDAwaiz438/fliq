"use client";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">LEGAL GOVERNANCE</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">TERMS OF SERVICE</h1>
        <span className="font-mono text-xs text-muted block mt-2">LAST UPDATED: AUGUST 14, 2026</span>
      </div>

      <div className="prose prose-zinc max-w-none text-xs text-zinc-700 space-y-6 leading-relaxed">
        <section>
          <h2 className="font-heading text-lg font-bold uppercase text-bone mb-2">1. OVERVIEW & ACCEPTANCE</h2>
          <p>
            Welcome to FLIQ Streetwear & Atelier ("FLIQ", "we", "us"). By accessing or purchasing from fliqstreetwear.com, you agree to bound by these Terms of Service. Please read them carefully before making a purchase.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold uppercase text-bone mb-2">2. LIMITED DROPS & QUANTITY LIMITS</h2>
          <p>
            All FLIQ products are released in capped limited batches. We reserve the right to limit purchase quantities per customer/address (typically max 2 units per style) to prevent automated reselling bot activity.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold uppercase text-bone mb-2">3. PRICING & PAYMENTS</h2>
          <p>
            Prices are listed in INR (Indian Rupees) inclusive of applicable GST for domestic customers. Payments must be settled in full prior to order dispatch via our integrated Razorpay or Stripe gateways.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold uppercase text-bone mb-2">4. INTELLECTUAL PROPERTY</h2>
          <p>
            All designs, graphic artwork, typography, and logos displayed on this site are the exclusive intellectual property of FLIQ Atelier. Unauthorized reproduction is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
