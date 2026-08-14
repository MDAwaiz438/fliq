'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, Minus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 3000 || subtotal === 0 ? 0 : 199;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FLIQ10') {
      setDiscount(subtotal * 0.1);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) py-(--section-pad-y) min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-(--text-display) tracking-[0.02em] mb-(--space-3)">YOUR CART IS EMPTY</h1>
        <p className="font-body text-muted mb-(--space-6) max-w-md">The latest drops are selling out fast.</p>
        <Link href="/shop">
          <Button variant="primary" size="lg">SHOP ALL DROPS</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-(--space-6) pb-(--section-pad-y)">
      <h1 className="font-display text-(--text-h1) tracking-[0.02em] mb-(--space-5) border-b border-border pb-(--space-3)">
        CART ({totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'})
      </h1>

      <div className="flex flex-col lg:flex-row gap-(--space-6)">
        {/* Cart Items List */}
        <div className="flex-1 flex flex-col gap-(--space-4)">
          {items.map((item) => (
            <div key={item.id} className="flex gap-(--space-4) bg-white p-(--space-4) border border-border rounded-sm shadow-xs hover:border-black/20 transition-colors duration-(--dur-base)">
              <div className="w-24 sm:w-32 aspect-4/5 bg-obsidian shrink-0 relative rounded-sm overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1 py-(--space-1)">
                <div className="flex justify-between items-start gap-(--space-3)">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-heading font-bold text-(--text-h3) uppercase tracking-[0.06em] hover:text-acid transition-colors duration-(--dur-fast)">
                      {item.name}
                    </Link>
                    <p className="font-body text-muted mt-(--space-1)">{item.color} / Size: {item.size}</p>
                  </div>
                  <span className="font-mono font-medium whitespace-nowrap text-(--text-body)">₹{item.price.toLocaleString('en-US')}</span>
                </div>

                <div className="flex justify-between items-end mt-(--space-3)">
                  <div className="flex items-center border border-border bg-white rounded-sm overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:text-acid hover:bg-zinc-100 transition-colors duration-(--dur-fast) cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center font-mono text-(--text-small)">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:text-acid hover:bg-zinc-100 transition-colors duration-(--dur-fast) cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-heading font-semibold uppercase text-muted hover:text-danger tracking-[0.06em] transition-colors duration-(--dur-fast) flex items-center gap-(--space-1) cursor-pointer"
                  >
                    <X size={14} /> REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Shipping Progress Bar */}
          <div className="bg-white p-(--space-4) border border-border rounded-sm shadow-xs flex flex-col gap-(--space-2) mt-(--space-3)">
            <span className={`font-heading font-semibold uppercase text-(--text-micro) tracking-[0.06em] ${shipping === 0 ? "text-acid font-bold" : "text-muted"}`}>
              {shipping === 0 ? "FREE SHIPPING UNLOCKED" : `ADD ₹${(3000 - subtotal).toLocaleString('en-US')} FOR FREE SHIPPING`}
            </span>
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-acid transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 3000) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar — sticky on desktop per Template G */}
        <div className="w-full lg:w-95 shrink-0">
          <div className="bg-white p-(--space-5) lg:sticky lg:top-18 border border-border rounded-sm shadow-xs">
            <h2 className="font-heading font-bold text-(--text-h2) uppercase tracking-[0.06em] mb-(--space-5) border-b border-border pb-(--space-3)">ORDER SUMMARY</h2>

            <div className="flex flex-col gap-(--space-2) font-body text-(--text-body) mb-(--space-5) border-b border-border pb-(--space-5)">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-mono">₹{subtotal.toLocaleString('en-US')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-acid">
                  <span>Discount</span>
                  <span className="font-mono">-₹{discount.toLocaleString('en-US')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className={`font-mono ${shipping === 0 ? "text-acid uppercase font-bold" : ""}`}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-(--space-5)">
              <span className="font-heading font-bold text-(--text-h2) uppercase tracking-[0.06em]">TOTAL</span>
              <span className="font-mono font-medium text-(--text-h1)">₹{total.toLocaleString('en-US')}</span>
            </div>

            <div className="flex gap-(--space-2) mb-(--space-5)">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-white border border-border rounded-sm px-(--space-3) py-(--space-2) font-mono uppercase text-(--text-small) outline-none transition-colors duration-(--dur-base) focus:border-acid"
              />
              <button
                onClick={handleApplyPromo}
                className="font-heading font-bold uppercase tracking-[0.06em] text-acid border border-acid rounded-sm px-(--space-4) hover:bg-acid hover:text-white transition-colors duration-(--dur-fast) cursor-pointer"
              >
                APPLY
              </button>
            </div>

            <Link href="/checkout">
              <Button variant="primary" size="lg" className="w-full flex justify-between items-center group">
                CHECKOUT <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
