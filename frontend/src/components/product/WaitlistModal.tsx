"use client";

import { useState } from "react";
import { Bell, X, Check, Sparkles } from "lucide-react";
import { BACKEND_URL } from "@/lib/api";

interface WaitlistModalProps {
  productSlug: string;
  productTitle: string;
  selectedSize?: string;
  onClose: () => void;
}

export default function WaitlistModal({
  productSlug,
  productTitle,
  selectedSize,
  onClose
}: WaitlistModalProps) {
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setLoading(true);

    try {
      await fetch(`${BACKEND_URL}/api/waitlist/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: contact.trim(),
          productSlug,
          productTitle,
          size: selectedSize || "All Sizes",
          type: "BACK_IN_STOCK"
        })
      });
    } catch {
      // Local fallback
    } finally {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-6 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">You&apos;re On The List!</h3>
            <p className="text-xs text-zinc-500 font-mono">
              We will send an instant SMS &amp; Email as soon as {selectedSize ? `Size ${selectedSize}` : "this item"} restocks.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Bell size={18} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                BACK-IN-STOCK ALERT
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-zinc-900 leading-snug">
                Get notified when restocked
              </h2>
              <p className="text-xs text-zinc-500 mt-1 font-mono">
                {productTitle} {selectedSize ? `— Size ${selectedSize}` : ""}
              </p>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1.5 uppercase">
                WhatsApp Number or Email Address
              </label>
              <input
                type="text"
                required
                placeholder="+91 98765 43210 or your@email.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} className="text-acid" />
              {loading ? "Registering..." : "Notify Me First"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
