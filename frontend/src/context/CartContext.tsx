"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/data";

export interface CartItem {
  id: string;          // A unique id for the cart item (product.id + size)
  product: Product;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fliq-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("fliq-cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, size: string) => {
    setItems((prev) => {
      const cartItemId = `${product.id}-${size}`;
      const existingItem = prev.find((item) => item.id === cartItemId);
      
      if (existingItem) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      return [...prev, { id: cartItemId, product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
