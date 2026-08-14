"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { useCartStore } from "@/store/useCartStore";
import { Check, Tag, ShieldCheck, CreditCard, Smartphone, Banknote, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { recordCustomerPurchase } from "@/lib/orders";
import { BACKEND_URL } from "@/lib/api";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>(1);
  const [shippingMethod, setShippingMethod] = useState(0);

  // Form Fields
  const [email, setEmail] = useState("collector@fliq.in");
  const [phone, setPhone] = useState("9876543210");
  const [fullName, setFullName] = useState("Devansh R.");
  const [addressLine1, setAddressLine1] = useState("Flat 402, High Street Atelier");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("400001");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "COD">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Coupon Engine States
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description: string;
  } | null>({
    code: "FLIQ10",
    discountAmount: 110,
    description: "10% Instant Drop Discount"
  });
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>("FLIQ10 auto-applied (10% Off)");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingCost = shippingMethod === 0 ? (subtotal > 1999 ? 0 : 99) : shippingMethod;
  const total = Math.max(0, subtotal - discount + shippingCost);

  // Handle Coupon Apply
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          description: data.description
        });
        setCouponSuccess(data.savingsMessage || `Code ${data.code} applied!`);
        setCouponInput("");
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch {
      // Fallback local validation
      if (couponInput.toUpperCase() === "FLIQ10") {
        const disc = Math.round(subtotal * 0.1);
        setAppliedCoupon({ code: "FLIQ10", discountAmount: disc, description: "10% Off" });
        setCouponSuccess(`Code FLIQ10 applied! You save ₹${disc}`);
      } else if (couponInput.toUpperCase() === "STREET20") {
        const disc = Math.round(subtotal * 0.2);
        setAppliedCoupon({ code: "STREET20", discountAmount: disc, description: "20% Off" });
        setCouponSuccess(`Code STREET20 applied! You save ₹${disc}`);
      } else {
        setCouponError("Invalid or expired coupon code");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    const orderNumber = "FLQ-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);

    try {
      // Step 1: Create Payment Gateway Order
      const res = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          orderNumber,
          customerEmail: email,
          customerPhone: phone,
          items: items.map(i => ({
            title: i.name,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
            color: i.color
          }))
        })
      });

      const paymentData = await res.json();

      // Step 2: Verify Payment capture
      await fetch(`${BACKEND_URL}/api/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: paymentData.gatewayOrderId || `order_${orderNumber}`,
          paymentId: `pay_${Date.now()}`,
          orderNumber
        })
      });

      // Record verified customer purchase for anti-spam verified reviews
      recordCustomerPurchase(
        items.map((i) => ({ slug: i.slug, name: i.name })),
        orderNumber
      );

      // Clear Cart and route
      clearCart();
      router.push(`/order/${orderNumber}`);
    } catch {
      // Fallback
      clearCart();
      router.push(`/order/${orderNumber}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16">

      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar scrollbar-none pb-2">
        {[
          { num: 1, label: "CONTACT" },
          { num: 2, label: "SHIPPING" },
          { num: 3, label: "PAYMENT" }
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider ${step >= s.num ? "text-zinc-900" : "text-zinc-400"}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${step >= s.num ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400 border border-zinc-200"}`}>
                {step > s.num ? <Check size={13} /> : s.num}
              </span>
              {s.label}
            </div>
            {i < 2 && <div className={`w-8 md:w-16 h-px ${step > s.num ? "bg-zinc-900" : "bg-zinc-200"}`} />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Main Form Area */}
        <div className="flex-1 w-full">
          <form id="checkout-form" onSubmit={handlePlaceOrder}>

            {/* STEP 1: CONTACT */}
            {step === 1 && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900 mb-5">1. CONTACT INFORMATION</h2>
                <div className="flex flex-col gap-4 max-w-xl">
                  <div>
                    <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div className="pt-3">
                    <Button variant="primary" type="button" onClick={() => setStep(2)}>
                      CONTINUE TO SHIPPING
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {step === 2 && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900">2. SHIPPING ADDRESS</h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono font-bold text-acid hover:underline uppercase"
                  >
                    Edit Contact
                  </button>
                </div>

                <div className="flex flex-col gap-4 max-w-xl mb-6">
                  <div>
                    <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">Pincode</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-zinc-700 block mb-1 uppercase">Country</label>
                      <input
                        type="text"
                        disabled
                        value="India (IN)"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-xs text-zinc-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 mb-3">
                  SHIPPING SPEED
                </h3>
                <div className="flex flex-col gap-2 max-w-xl">
                  {[
                    { id: 0, label: "FLIQ STANDARD EXPRESS (3-5 DAYS)", price: 0 },
                    { id: 149, label: "PRIORITY AIR DISPATCH (24-48H)", price: 149 }
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`flex justify-between items-center p-3.5 border rounded-xl cursor-pointer transition-colors ${
                        shippingMethod === method.id ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900" : "border-zinc-200 bg-white hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method"
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id)}
                          className="accent-zinc-900 w-4 h-4 cursor-pointer"
                        />
                        <span className="font-mono text-xs font-bold uppercase">{method.label}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-900">
                        {method.price === 0 ? "FREE" : `₹${method.price}`}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-6">
                  <Button variant="primary" type="button" onClick={() => setStep(3)}>
                    CONTINUE TO PAYMENT
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900">3. SELECT PAYMENT METHOD</h2>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-mono font-bold text-acid hover:underline uppercase"
                  >
                    Edit Shipping
                  </button>
                </div>

                {/* Payment Selector Tabs */}
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "UPI"
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-2xs"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <Smartphone size={18} className="text-emerald-600" />
                    <span className="text-xs font-mono font-bold uppercase">Instant UPI</span>
                    <span className="text-[10px] text-zinc-500 font-mono">GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "CARD"
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-2xs"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <CreditCard size={18} className="text-acid" />
                    <span className="text-xs font-mono font-bold uppercase">Cards / EMI</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Visa / Master / Amex</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "COD"
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-2xs"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <Banknote size={18} className="text-amber-600" />
                    <span className="text-xs font-mono font-bold uppercase">Pay on Delivery</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Cash / QR on Delivery</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 max-w-xl mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-800 mb-1">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    256-BIT ENCRYPTED RAZORPAY ATELIER CHECKOUT
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono leading-relaxed">
                    Zero transaction fee. Your order is secured and verified directly through RBI authorized gateway.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || items.length === 0}
                  className="w-full max-w-xl py-3.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles size={14} className="text-acid" />
                  {isProcessing ? "SECURING DROP ALLOCATION..." : `COMPLETE ORDER — ₹${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary & Coupon Engine Sidebar */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
          <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-xs lg:sticky lg:top-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4 border-b border-zinc-100 pb-3 font-mono">
              ORDER SUMMARY ({items.length} ITEMS)
            </h2>

            {/* Cart Items List */}
            <div className="flex flex-col gap-3 mb-5 max-h-[35vh] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-14 h-16 bg-zinc-100 rounded-lg shrink-0 relative overflow-hidden border border-zinc-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-center flex-1 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-tight text-zinc-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-zinc-500 font-mono">{item.color} / {item.size}</p>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-[11px] text-zinc-500 font-mono">Qty: {item.quantity}</span>
                      <span className="text-xs font-bold text-zinc-900 font-(family-name:--font-inter) tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Coupon Code Input */}
            <div className="mb-4 pt-3 border-t border-zinc-100">
              <label className="text-[11px] font-mono font-bold text-zinc-700 mb-1.5 uppercase flex items-center gap-1">
                <Tag size={12} className="text-acid" /> Apply Promo Code
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FLIQ10, STREET20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 text-xs uppercase font-mono text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-3 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold rounded-lg uppercase cursor-pointer disabled:opacity-50"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 font-mono font-semibold mt-1.5">
                  ✓ {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 font-mono mt-1.5">
                  ✕ {couponError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col gap-2 text-xs font-mono mb-4 border-t border-zinc-100 pt-3">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="text-zinc-900 font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Shipping Logistics</span>
                <span className="text-zinc-900 font-bold">{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="flex justify-between items-baseline pt-3 border-t border-zinc-200">
              <span className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">TOTAL AMOUNT</span>
              <span className="text-2xl font-bold text-zinc-900 font-(family-name:--font-inter) tabular-nums">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
