"use client";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">DATA PROTECTION</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">PRIVACY POLICY</h1>
        <span className="font-mono text-xs text-muted block mt-2">LAST UPDATED: AUGUST 14, 2026</span>
      </div>

      <div className="prose prose-zinc max-w-none text-xs text-zinc-700 space-y-6 leading-relaxed">
        <section>
          <h2 className="font-heading text-lg font-bold uppercase text-bone mb-2">1. INFORMATION WE COLLECT</h2>
          <p>
            We collect personal data required to fulfill your drop orders, including your name, shipping address, email address, phone number for OTP verification, and order transaction history.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold uppercase text-bone mb-2">2. HOW WE USE YOUR DATA</h2>
          <p>
            Your information is used strictly to process orders, coordinate courier delivery via Shiprocket, provide customer support, and send drop countdown notifications (if opted-in).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold uppercase text-bone mb-2">3. THIRD-PARTY SHARING</h2>
          <p>
            We never sell your data to third parties. Data is shared exclusively with verified logistics partners (Shiprocket, BlueDart) and payment processors (Razorpay, Stripe) to execute your transaction.
          </p>
        </section>
      </div>
    </div>
  );
}
