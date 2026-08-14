"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "How do FLIQ drop releases work?",
      a: "FLIQ operates on a limited drop model. Each capsule collection is released on a specific date in capped quantities (usually 250 pieces per item). Once sold out, items transition to the permanent archive and are never re-printed.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking, Mobikwik/Amazon Pay Wallets, and Cash on Delivery (COD with pin code verification). International orders use Stripe (Credit Card, Apple Pay).",
    },
    {
      q: "How can I track my order status?",
      a: "As soon as your order dispatches, you will receive an SMS and Email with your Shiprocket AWB tracking link. You can also track guest orders anytime on our /track-order page.",
    },
    {
      q: "What is your fit and sizing like?",
      a: "FLIQ garments feature an architectural oversized cut with boxy proportions and dropped shoulders. If you prefer your standard streetwear fit, order your true size. For a fitted look, choose one size down.",
    },
    {
      q: "Can I return or exchange a drop item?",
      a: "Yes! We offer a 7-day return/exchange policy for unused items with original security tags. You can schedule a doorstep reverse pickup directly through your Account dashboard.",
    },
    {
      q: "Are FLIQ garments 100% cotton?",
      a: "Yes! Our hoodies are crafted from 450GSM custom loopback 100% cotton, and our t-shirts use 280GSM heavy combed cotton jersey.",
    },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">HELP & KNOWLEDGE BASE</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">FREQUENTLY ASKED QUESTIONS</h1>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mb-10">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search question (e.g. drop, shipping, size, return)..."
          className="w-full bg-white border border-zinc-300 rounded-sm py-3 pl-12 pr-4 text-sm font-body text-bone placeholder:text-zinc-400 focus:outline-none focus:border-acid shadow-xs"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 max-w-3xl">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left font-heading font-bold text-base uppercase text-bone flex justify-between items-center hover:text-acid transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`transition-transform ${isOpen ? "rotate-180 text-acid" : "text-zinc-400"}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 font-body">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
