"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 3000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

          {/* Drawer Header */}
          <div className="p-5 border-b border-border flex justify-between items-center bg-obsidian">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-acid" />
              <h3 className="font-heading font-bold text-lg text-bone uppercase tracking-wider">YOUR CART ({items.reduce((a, b) => a + b.quantity, 0)})</h3>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-sm text-muted hover:text-bone hover:bg-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-blue-50/60 p-3.5 border-b border-blue-200 text-xs flex flex-col gap-1.5 font-heading font-semibold uppercase tracking-wider">
            <div className="flex justify-between items-center text-blue-950">
              <span>{amountToFreeShipping === 0 ? "🎉 FREE EXPRESS SHIPPING UNLOCKED!" : `ADD ₹${amountToFreeShipping.toLocaleString('en-US')} FOR FREE SHIPPING`}</span>
              <span className="font-mono text-[11px] text-blue-700">{Math.round(shippingProgressPct)}%</span>
            </div>
            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-acid rounded-full transition-all duration-500"
                style={{ width: `${shippingProgressPct}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-obsidian border border-border flex items-center justify-center text-muted">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-bone uppercase tracking-wider">YOUR CART IS EMPTY</h4>
                  <p className="text-xs text-muted mt-1">Discover limited drop releases and upgrade your gear.</p>
                </div>
                <Button variant="primary" onClick={closeCart}>
                  EXPLORE SHOP
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border border-border rounded-sm bg-onyx relative group">
                  <div className="w-20 h-24 relative bg-obsidian shrink-0 rounded-sm overflow-hidden border border-border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex flex-col justify-between flex-1 py-0.5">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-heading font-bold text-sm text-bone uppercase tracking-wider line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Remove Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-mono text-muted mt-0.5">{item.color} / Size: {item.size}</p>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-border bg-white rounded-sm overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-bone hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center font-mono text-xs font-bold text-bone">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-bone hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-sm text-acid">₹{(item.price * item.quantity).toLocaleString('en-US')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-border bg-white flex flex-col gap-4 shadow-lg">
              <div className="flex justify-between items-center font-heading font-bold uppercase tracking-wider text-sm">
                <span className="text-muted">SUBTOTAL</span>
                <span className="font-mono text-lg text-bone">₹{subtotal.toLocaleString('en-US')}</span>
              </div>
              <p className="text-[11px] font-mono text-muted">Taxes and shipping calculated at checkout.</p>

              <Link href="/checkout" onClick={closeCart} className="w-full">
                <Button variant="primary" size="lg" className="w-full flex justify-between items-center group">
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/cart" onClick={closeCart} className="text-center font-heading font-bold text-xs text-acid hover:underline uppercase tracking-wider">
                VIEW FULL CART & PROMO CODES
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
