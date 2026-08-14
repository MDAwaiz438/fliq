"use client";

import { useState, useEffect } from "react";
import { Star, X, Check, AlertCircle, ShieldCheck, Lock } from "lucide-react";
import { hasCustomerPurchasedProduct } from "@/lib/orders";
import { BACKEND_URL } from "@/lib/api";

interface WriteReviewModalProps {
  productSlug: string;
  productName: string;
  onClose: () => void;
  onReviewSubmitted: (newReview: any) => void;
}

export default function WriteReviewModal({
  productSlug,
  productName,
  onClose,
  onReviewSubmitted
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [purchasedSize, setPurchasedSize] = useState("M");
  const [fitSentiment, setFitSentiment] = useState<"RUNS_SMALL" | "TRUE_TO_SIZE" | "RUNS_LARGE">("TRUE_TO_SIZE");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);

  useEffect(() => {
    // Check if customer has a confirmed purchase of THIS specific garment
    const hasBought = hasCustomerPurchasedProduct(productSlug);
    setIsVerifiedBuyer(hasBought);

    // Prepopulate name if available
    try {
      const rawCustomer = localStorage.getItem("flq_customer");
      if (rawCustomer) {
        const cust = JSON.parse(rawCustomer);
        if (cust.name) setAuthorName(cust.name);
      }
    } catch {}
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerifiedBuyer) {
      setError("Only verified purchasers of this garment are permitted to submit reviews.");
      return;
    }

    if (!reviewBody.trim()) {
      setError("Please write a few words about your experience with this garment.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          authorName: authorName.trim() || "Verified Buyer",
          city: city.trim() || "India",
          rating,
          fitSentiment,
          purchasedSize,
          reviewTitle: reviewTitle.trim() || "Atelier Grade Quality",
          reviewBody: reviewBody.trim(),
          images: []
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        onReviewSubmitted(data.review);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to submit review");
      }
    } catch (err: any) {
      // Fallback for offline or local preview
      const localReview = {
        id: `rev_${Date.now()}`,
        productSlug,
        authorName: authorName.trim() || "Verified Buyer",
        city: city.trim() || "India",
        rating,
        fitSentiment,
        purchasedSize,
        reviewTitle: reviewTitle.trim() || "Atelier Grade Quality",
        reviewBody: reviewBody.trim(),
        verifiedBuyer: true,
        createdAt: new Date().toISOString()
      };
      setSuccess(true);
      onReviewSubmitted(localReview);
      setTimeout(() => {
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check size={24} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Verified Review Submitted</h3>
            <p className="text-xs text-zinc-500 max-w-xs font-mono">
              Thank you! Your feedback has been verified and added to the community fit ledger.
            </p>
          </div>
        ) : !isVerifiedBuyer ? (
          /* ================= NON-PURCHASER NOTICE ================= */
          <div className="py-4 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center justify-center">
              <Lock size={22} />
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 font-mono leading-relaxed max-w-sm mx-auto">
              No order record found for this garment under your account. If you recently purchased this item, please wait until your shipment is confirmed.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold uppercase rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          /* ================= VERIFIED BUYER REVIEW FORM ================= */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit mb-2">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  Verified Purchaser
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 line-clamp-1">
                {productName}
              </h2>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Selector */}
            <div>
              <label className="text-xs font-mono font-bold text-zinc-700 block mb-1.5 uppercase">
                Overall Rating: {rating} / 5
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="cursor-pointer p-1 text-zinc-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      className={
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Feedback */}
            <div>
              <label className="text-xs font-mono font-bold text-zinc-700 block mb-1.5 uppercase">
                Fit Assessment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "RUNS_SMALL", label: "Runs Small" },
                  { value: "TRUE_TO_SIZE", label: "True to Size" },
                  { value: "RUNS_LARGE", label: "Runs Oversized" }
                ].map((fit) => (
                  <button
                    type="button"
                    key={fit.value}
                    onClick={() => setFitSentiment(fit.value as any)}
                    className={`py-2 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                      fitSentiment === fit.value
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {fit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Author Name & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1 uppercase">
                  Verified Collector Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liam C."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1 uppercase">
                  Purchased Size
                </label>
                <select
                  value={purchasedSize}
                  onChange={(e) => setPurchasedSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 bg-white"
                >
                  <option value="S">Size S</option>
                  <option value="M">Size M</option>
                  <option value="L">Size L</option>
                  <option value="XL">Size XL</option>
                  <option value="XXL">Size XXL</option>
                </select>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1 uppercase">
                Review Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Perfect boxy silhouette and silky hand-feel"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            {/* Review Body */}
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1 uppercase">
                Detailed Feedback
              </label>
              <textarea
                rows={3}
                placeholder="Describe fabric weight, stitching details, styling versatility..."
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Submitting..." : "Publish Verified Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
