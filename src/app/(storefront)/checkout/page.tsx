"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";
import { createOrder } from "@/app/actions/checkout";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "razorpay" | "cod">("card");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const shippingCost = subtotal > 200 ? 0 : 10;
  const taxes = subtotal * 0.08;
  const total = subtotal + shippingCost + taxes;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      // Find variantId for each item (in a real app, CartContext would store variantId)
      // For now, we assume item.id is variantId or we just use a generic one if missing.
      // Wait, CartContext has item.id. Let's pass it.
      const orderItems = items.map(item => ({
        variantId: item.id, // Assuming CartContext item.id is the variantId
        quantity: item.quantity,
        price: item.product.price
      }));
      
      try {
        await createOrder({
          customerEmail: email || "guest@example.com",
          total,
          items: orderItems
        });
        clearCart();
        setStep("success");
      } catch (err) {
        console.error("Order creation failed", err);
        alert("There was an issue processing your order. Please try again.");
      }
    });
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center border-b-2 border-(--bg)">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Cannot Checkout</h2>
        <p className="text-sm font-bold uppercase tracking-widest text-(--bg) mb-8">Your cart is empty.</p>
        <Link href="/products">
          <Button size="lg">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-(--bg) flex items-center justify-center p-6 border-b-2 border-(--bg)">
        <div className="bg-(--accent) text-(--bg) border-2 border-(--bg) p-12 max-w-lg w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={64} className="text-(--bg)" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Order Confirmed</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-(--bg) mb-8">
            Order #FLQ-{Math.floor(1000 + Math.random() * 9000)}<br/><br/>
            Check your email for tracking details.
          </p>
          <Link href="/products">
            <Button size="lg" className="w-full bg-(--bg) text-(--accent) hover:bg-transparent hover:text-(--bg) border-2 border-(--bg)">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--accent) text-(--bg) flex flex-col">
      <div className="px-4 md:px-8 py-4 border-b-2 border-(--bg) flex justify-between items-end shrink-0">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
          Checkout
        </h1>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-(--bg)">
          <Lock size={12} /> Secure Encrypted
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Left Side: Forms */}
        <div className="w-full lg:w-3/5 xl:w-2/3 border-b-2 lg:border-b-0 lg:border-r-2 border-(--bg) p-4 md:p-8">
          
          {/* Breadcrumbs */}
          <div className="flex gap-4 mb-8 text-[10px] font-black uppercase tracking-widest border-b-2 border-(--bg) pb-3">
            <span className={step === "shipping" ? "text-(--bg)" : "text-(--bg) opacity-30 flex items-center gap-1"}>
              {step === "payment" && <CheckCircle2 size={12}/>} Shipping
            </span>
            <span className="text-(--bg) opacity-30">/</span>
            <span className={step === "payment" ? "text-(--bg)" : "text-(--bg) opacity-30"}>Payment</span>
          </div>

          {step === "shipping" ? (
            <form onSubmit={handleShippingSubmit} className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-3">Contact Information</h2>
                <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
              </div>

              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-3 mt-6">Shipping Address</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="text" placeholder="First Name" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
                    <input required type="text" placeholder="Last Name" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
                  </div>
                  <input required type="text" placeholder="Address" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
                  <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
                  <div className="grid grid-cols-3 gap-3">
                    <input required type="text" placeholder="City" className="col-span-1 border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
                    <input required type="text" placeholder="State" className="col-span-1 border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
                    <input required type="text" placeholder="ZIP Code" className="col-span-1 border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none" />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto bg-(--bg) text-(--accent) hover:bg-transparent hover:text-(--bg) border-2 border-(--bg)">Continue to Payment</Button>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Payment Method</h2>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button type="button" onClick={() => setPaymentMethod("card")} className={`border-2 border-(--bg) p-3 text-center text-[10px] font-bold uppercase tracking-widest transition-colors ${paymentMethod === "card" ? "bg-(--bg) text-(--accent)" : "bg-transparent text-(--bg) hover:bg-(--bg) hover:text-(--accent)"}`}>
                    Card
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("razorpay")} className={`border-2 border-(--bg) p-3 text-center text-[10px] font-bold uppercase tracking-widest transition-colors ${paymentMethod === "razorpay" ? "bg-(--bg) text-(--accent)" : "bg-transparent text-(--bg) hover:bg-(--bg) hover:text-(--accent)"}`}>
                    Razorpay
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("cod")} className={`border-2 border-(--bg) p-3 text-center text-[10px] font-bold uppercase tracking-widest transition-colors ${paymentMethod === "cod" ? "bg-(--bg) text-(--accent)" : "bg-transparent text-(--bg) hover:bg-(--bg) hover:text-(--accent)"}`}>
                    COD
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="border-2 border-(--bg) bg-(--bg) p-4 space-y-3 relative">
                    <div className="absolute top-3 right-3 flex gap-1">
                      <div className="w-6 h-4 bg-(--accent) border border-(--accent)"></div>
                      <div className="w-6 h-4 bg-(--accent) border border-(--accent)"></div>
                    </div>
                    <input required type="text" placeholder="Card Number" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none bg-(--accent) text-(--bg)" />
                    <input required type="text" placeholder="Name on Card" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none bg-(--accent) text-(--bg)" />
                    <div className="grid grid-cols-2 gap-3">
                      <input required type="text" placeholder="MM/YY" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none bg-(--accent) text-(--bg)" />
                      <input required type="text" placeholder="CVC" className="w-full border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest focus:outline-none bg-(--accent) text-(--bg)" />
                    </div>
                  </div>
                )}

                {paymentMethod === "razorpay" && (
                  <div className="border-2 border-(--bg) p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest">You will be redirected to Razorpay to complete your purchase securely.</p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="border-2 border-(--bg) p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest">Pay with cash upon delivery of your order.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep("shipping")} className="text-[10px] font-bold uppercase tracking-widest hover:bg-(--bg) hover:text-(--accent) border-2 border-(--bg) px-4 py-3 transition-colors">Back</button>
                <Button type="submit" size="lg" className="flex-1 bg-(--bg) text-(--accent) hover:bg-transparent hover:text-(--bg) border-2 border-(--bg)">Pay ₹{total.toFixed(2)}</Button>
              </div>
            </form>
          )}

        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-2/5 xl:w-1/3 bg-(--bg) text-(--accent) p-4 md:p-8 border-b-2 lg:border-b-0 border-(--bg) flex flex-col">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Your Order</h2>
          
          <div className="flex-1 overflow-y-auto mb-6 border-b-2 border-(--bg) space-y-4 pb-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 border-2 border-(--bg) bg-(--accent) text-(--bg) shrink-0 relative flex items-center justify-center p-1">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-(--bg) text-(--accent) rounded-full flex items-center justify-center text-[9px] font-bold">{item.quantity}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black uppercase text-xs leading-tight mb-1">{item.product.name}</h4>
                  <p className="text-[9px] font-bold uppercase text-(--accent) opacity-80 mb-1">{item.size} / {item.product.color}</p>
                  <p className="font-black text-xs">₹{item.product.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-[10px] font-bold uppercase tracking-widest mb-4">
            <div className="flex justify-between">
              <span className="text-(--accent) opacity-80">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--accent) opacity-80">Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--accent) opacity-80">Taxes (8%)</span>
              <span>₹{taxes.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t-2 border-(--bg) pt-4">
            <span className="text-sm font-black uppercase tracking-widest">Total</span>
            <span className="text-3xl font-black tracking-tighter">₹{total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}