"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import { Button } from "./Button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size", {
        position: "bottom-right",
      });
      return;
    }

    addToCart(product, selectedSize);
    toast.success(`${product.name} added to cart`, {
      description: `Size: ${selectedSize} | ₹${product.price}`,
      position: "bottom-right",
      duration: 3000,
    });
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const sizes = product.category === "Footwear" 
    ? ["7", "8", "9", "10", "11", "12"]
    : ["S", "M", "L", "XL"];

  const images = product.images.length > 0 ? product.images : ["/placeholder.jpg"];

  return (
    <div className="flex flex-col lg:flex-row border-b border-(--border)">
      
      {/* Left: Image Gallery */}
      <div className="w-full lg:w-3/5 xl:w-2/3 border-b lg:border-b-0 lg:border-r border-(--border) flex flex-col bg-(--bg-surface) lg:h-[calc(100vh-72px)] md:h-[calc(100vh-88px)] relative">
        <div className="flex-1 w-full h-full relative overflow-hidden">
          {product.isNew && (
            <div className="absolute top-8 left-8 bg-(--accent) text-(--bg) px-4 py-2 text-xs font-bold uppercase tracking-widest z-10">
              New Arrival
            </div>
          )}
          <img 
            src={images[currentImageIndex]} 
            alt={`${product.name} detail`} 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-8 flex gap-2">
            {images.map((src, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImageIndex(i)}
                className={`w-16 h-16 border transition-all duration-200 ${currentImageIndex === i ? 'border-(--accent)' : 'border-(--border) opacity-50 hover:opacity-100 hover:border-(--accent)'}`}
                style={{ transitionTimingFunction: 'var(--ease-out)' }}
              >
                <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Info */}
      <div className="w-full lg:w-2/5 xl:w-1/3 bg-(--bg)">
        <div className="lg:h-[calc(100vh-72px)] md:h-[calc(100vh-88px)] overflow-y-auto hide-scrollbar flex flex-col">
          
          <div className="p-8 md:p-12 xl:p-16 flex flex-col flex-1">
            <div className="mb-10">
              <h1 className="font-(family-name:--font-display) text-4xl md:text-5xl xl:text-6xl font-bold uppercase tracking-tighter leading-none mb-4 text-(--text-primary)">
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-(--accent)">₹{product.price}</p>
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold uppercase tracking-widest text-xs text-(--text-primary)">Select Size</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--text-muted) underline underline-offset-4 cursor-pointer hover:text-(--accent) transition-colors">Size Guide</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border flex items-center justify-center font-bold uppercase transition-all duration-200 ${
                      selectedSize === size 
                        ? 'border-(--accent) bg-(--accent) text-(--bg)' 
                        : 'border-(--border) hover:border-(--accent) text-(--text-primary)'
                    }`}
                    style={{ transitionTimingFunction: 'var(--ease-out)' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button size="lg" className="w-full mb-12" onClick={handleAddToCart}>
              {selectedSize ? `Add to Cart - ₹${product.price}` : 'Select Size'}
            </Button>

            {/* Accordions */}
            <div className="mt-auto border-t border-(--border)">
              {/* Product Details */}
              <div className="border-b border-(--border)">
                <button 
                  onClick={() => toggleAccordion('details')}
                  className="w-full py-6 flex justify-between items-center text-left"
                >
                  <span className="font-(family-name:--font-display) font-semibold uppercase tracking-widest text-sm text-(--text-primary)">Product Details</span>
                  {openAccordion === 'details' 
                    ? <ChevronUp size={20} className="text-(--accent)" /> 
                    : <ChevronDown size={20} className="text-(--text-muted)" />
                  }
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'details' ? 'max-h-96 pb-6' : 'max-h-0'}`} style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                  <p className="text-sm font-medium uppercase tracking-wide text-(--text-muted) leading-relaxed">
                    {product.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-xs font-bold uppercase tracking-widest text-(--text-muted)">
                    <li className="flex justify-between"><span>Color:</span> <span className="text-(--text-primary)">{product.color}</span></li>
                    <li className="flex justify-between"><span>Category:</span> <span className="text-(--text-primary)">{product.category}</span></li>
                    <li className="flex justify-between"><span>Material:</span> <span className="text-(--text-primary)">100% Raw</span></li>
                  </ul>
                </div>
              </div>

              {/* Shipping */}
              <div className="border-b border-(--border)">
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-6 flex justify-between items-center text-left"
                >
                  <span className="font-(family-name:--font-display) font-semibold uppercase tracking-widest text-sm text-(--text-primary)">Shipping & Returns</span>
                  {openAccordion === 'shipping' 
                    ? <ChevronUp size={20} className="text-(--accent)" /> 
                    : <ChevronDown size={20} className="text-(--text-muted)" />
                  }
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'shipping' ? 'max-h-96 pb-6' : 'max-h-0'}`} style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                  <p className="text-sm font-medium uppercase tracking-wide text-(--text-muted) leading-relaxed mb-4">
                    Free standard shipping on all orders over ₹200. Orders are processed within 1-2 business days.
                  </p>
                  <p className="text-sm font-medium uppercase tracking-wide text-(--text-muted) leading-relaxed">
                    Returns accepted within 14 days of delivery. Items must be in original condition with tags attached.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
