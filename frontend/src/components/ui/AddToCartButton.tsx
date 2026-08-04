"use client";

import { toast } from "sonner";
import { Button } from "./Button";
import { Product } from "@/lib/data";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart`, {
      description: `Color: ${product.color} | $${product.price}`,
      position: "bottom-right",
      duration: 3000,
    });
  };

  return (
    <Button size="lg" className="w-full md:w-auto mt-4" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
}
