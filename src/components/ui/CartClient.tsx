"use client";

import Link from "next/link";
import { Button } from "./Button";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";

export function CartClient() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center border-b border-(--border) bg-(--bg)">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-(--text-primary)">Your Cart is Empty</h2>
        <p className="text-sm font-bold uppercase tracking-widest text-(--text-muted) mb-8">No drops in the bag yet.</p>
        <Link href="/products">
          <Button size="lg">Explore Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[60vh]">
      {/* Cart Items */}
      <div className="w-full lg:w-2/3 border-b lg:border-b-0 lg:border-r border-(--border)">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row border-b border-(--border) last:border-b-0 lg:last:border-b">
            <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto sm:h-56 bg-(--bg-surface) border-b sm:border-b-0 sm:border-r border-(--border) p-4 flex items-center justify-center">
              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
            </div>
            <div className="w-full sm:w-2/3 p-6 flex flex-col justify-between bg-(--bg)">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-(family-name:--font-display) font-bold uppercase text-xl text-(--text-primary)">{item.product.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-(--text-muted) mt-2">Size: {item.size} | Color: {item.product.color}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-(--text-muted) hover:text-(--danger) transition-colors p-2 -mr-2 -mt-2"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex justify-between items-end mt-8">
                <div className="flex border border-(--border)">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-(--text-primary) hover:bg-(--accent) hover:text-(--bg) transition-colors disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center font-bold text-sm text-(--text-primary)">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-(--text-primary) hover:bg-(--accent) hover:text-(--bg) transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-2xl text-(--accent)">₹{item.product.price * item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3 p-8 md:p-12 bg-(--bg-surface)">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold uppercase tracking-tighter mb-10 text-(--text-primary)">Order Summary</h2>
        
        <div className="space-y-6 mb-10 text-sm font-bold uppercase tracking-widest">
          <div className="flex justify-between">
            <span className="text-(--text-muted)">Subtotal</span>
            <span className="text-(--text-primary)">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-muted)">Shipping</span>
            <span className="text-(--text-primary)">Calculated at checkout</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-muted)">Taxes</span>
            <span className="text-(--text-primary)">Calculated at checkout</span>
          </div>
        </div>

        <div className="pt-6 border-t border-(--border) mb-10 flex justify-between items-end">
          <span className="font-(family-name:--font-display) font-bold uppercase tracking-widest text-lg text-(--text-primary)">Total</span>
          <span className="font-bold text-4xl text-(--accent)">₹{subtotal.toFixed(2)}</span>
        </div>

        <Link href="/checkout" className="block w-full">
          <Button size="lg" className="w-full">Proceed to Checkout</Button>
        </Link>
        
        <p className="text-center text-[10px] uppercase font-bold text-(--text-muted) mt-6 tracking-widest">
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  );
}
