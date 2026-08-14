"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/shop/ProductCard";
import ProductImageZoom from "@/components/product/ProductImageZoom";
import SizeGuideModal from "@/components/product/SizeGuideModal";
import WriteReviewModal from "@/components/product/WriteReviewModal";
import WaitlistModal from "@/components/product/WaitlistModal";
import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Check,
  Ruler,
  Maximize2,
  ShoppingBag,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  Bell,
  X
} from "lucide-react";
import {
  getProductBySlugSync,
  fetchAllProducts,
  normalizeSlug
} from "@/lib/products";
import { isProductWishlisted, toggleCustomerWishlist, isCustomerAuthenticated } from "@/lib/wishlist";
import { BACKEND_URL } from "@/lib/api";

interface ProductDetailData {
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  fabric: string;
  fabricGsm?: string;
  fitProfile?: string;
  hsnCode?: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stockQuantity?: number;
}

const PRODUCTS_DATABASE: Record<string, ProductDetailData> = {
  "viscose-embroidered-shirt": {
    slug: "viscose-embroidered-shirt",
    name: "100% Viscose Embroidered Box Fit Shirt, Cuban Collar, Relaxed Drop Shoulder Casual Resort Wear for Men",
    category: "CASUAL SHIRTS",
    price: 1099,
    originalPrice: 1599,
    discount: "31% OFF",
    rating: 4.9,
    reviewsCount: 54,
    description: "Relaxed box-fit Cuban collar shirt constructed from 100% breathable Viscose rayon fabric. Features hand-embroidered resort motifs, dropped shoulder tailoring, and tonal mother-of-pearl buttons.",
    details: [
      "100% Premium Viscose Rayon (160GSM) for an ultra-breathable, silky hand feel",
      "Signature hand-embroidered resort botanical and palm motifs on front panels",
      "Boxy relaxed Cuban notch collar silhouette engineered for warm climates",
      "Custom tonal mother-of-pearl engraved buttons with reinforced cross-stitching",
      "Pre-washed fabric ensuring zero shrinkage after delicate cold washing"
    ],
    fabric: "100% Premium Viscose Rayon",
    fabricGsm: "160 GSM Viscose",
    fitProfile: "Relaxed Box Fit",
    hsnCode: "6109.10.00",
    images: [
      "/images/shirt_viscose.png",
      "/images/hero.png",
      "/images/editorial.png",
      "/images/product_distortion.png"
    ],
    colors: [
      { name: "Cream Off-White", hex: "#FDFBF7" },
      { name: "Onyx Black", hex: "#09090B" },
      { name: "Cobalt Blue", hex: "#2563EB" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockQuantity: 24
  },
  "brown-regular-fit-shirt": {
    slug: "brown-regular-fit-shirt",
    name: "Brown Regular Fit French Linen Outer Shirt, Casual Layering Spread Collar for Men",
    category: "CASUAL SHIRTS",
    price: 1299,
    originalPrice: 1799,
    discount: "28% OFF",
    rating: 4.8,
    reviewsCount: 42,
    description: "Versatile regular-fit unbuttoned outer shirt crafted from breathable French linen cotton blend. Designed for effortless layering over basic tees.",
    details: [
      "French Linen Cotton blend fabric",
      "Curved hem design with reinforced side gussets",
      "Soft washed finish for vintage hand-feel"
    ],
    fabric: "65% Linen, 35% Combed Cotton",
    fabricGsm: "180 GSM Linen Blend",
    fitProfile: "Regular Fit Layering Outer",
    images: ["/images/shirt_brown.png", "/images/editorial.png", "/images/shirt_viscose.png", "/images/hero.png"],
    colors: [
      { name: "Earth Brown", hex: "#5D4037" },
      { name: "Onyx Black", hex: "#09090B" }
    ],
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 18
  },
  "distortion-hoodie": {
    slug: "distortion-hoodie",
    name: "Distortion Oversized Heavyweight 450GSM French Terry Hoodie, Distress Seam Detailing",
    category: "HOODIES",
    price: 3499,
    originalPrice: 4499,
    discount: "22% OFF",
    rating: 5.0,
    reviewsCount: 94,
    description: "Oversized heavyweight hoodie featuring custom distress detailing and signature cobalt seam stitching accents. Made from 450GSM French Terry cotton. Drop 03 exclusive.",
    details: [
      "450GSM 100% Heavyweight French Terry Cotton",
      "Cobalt contrast seam stitching accents",
      "Double-layered oversized structured hood",
      "Limited batch numbered serial label"
    ],
    fabric: "100% French Terry Cotton (450 GSM)",
    fabricGsm: "450 GSM Loopback Fleece",
    fitProfile: "Heavyweight Boxy Drop-Shoulder",
    images: ["/images/product_distortion.png", "/images/hero.png", "/images/editorial.png", "/images/shirt_viscose.png"],
    colors: [
      { name: "Onyx Black", hex: "#09090B" },
      { name: "Cobalt Blue", hex: "#2563EB" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stockQuantity: 42
  }
};

export default function ProductDetail() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "100-viscose-embroidered-box-fit-shirt";

  // Slug normalization
  const normalizedKey = useMemo(() => {
    const norm = normalizeSlug(rawSlug);
    if (norm.includes("viscose") && norm.includes("embroidered")) {
      return "viscose-embroidered-shirt";
    }
    return norm;
  }, [rawSlug]);

  // Initial Product Data Resolution
  const [productData, setProductData] = useState<ProductDetailData>(() => {
    if (PRODUCTS_DATABASE[rawSlug]) return PRODUCTS_DATABASE[rawSlug];
    if (PRODUCTS_DATABASE[normalizedKey]) return PRODUCTS_DATABASE[normalizedKey];

    const found = getProductBySlugSync(rawSlug) || getProductBySlugSync(normalizedKey);
    if (found) {
      const orig = found.originalPrice || Math.round(found.price * 1.35);
      const discountPct = Math.round(((orig - found.price) / orig) * 100);
      return {
        slug: found.slug,
        name: found.title,
        category: found.category || "CASUAL SHIRTS",
        price: found.price,
        originalPrice: orig,
        discount: `${discountPct}% OFF`,
        rating: 4.9,
        reviewsCount: 48,
        description: found.description || "Crafted from premium heavyweight fabric with signature FLIQ tailoring.",
        details: found.details && found.details.length > 0 ? found.details : [
          "100% Breathable Premium Viscose / Cotton construction",
          "Relaxed silhouette engineered for comfort",
          "Durable reinforced seam stitching"
        ],
        fabric: found.fabric || found.fabricGsm || "100% Premium Viscose Rayon",
        fabricGsm: found.fabricGsm || "160 GSM",
        fitProfile: found.fitProfile || "Relaxed Box Fit",
        hsnCode: found.hsnCode || "6109.10.00",
        images: found.images && found.images.length > 0 ? found.images : [found.image || "/images/shirt_viscose.png"],
        colors: found.colors && found.colors.length > 0 ? found.colors : [
          { name: "Cream Off-White", hex: "#FDFBF7" },
          { name: "Onyx Black", hex: "#09090B" }
        ],
        sizes: found.sizes && found.sizes.length > 0 ? found.sizes : ["S", "M", "L", "XL", "XXL"],
        stockQuantity: found.inventoryQuantity ?? 24
      };
    }

    return PRODUCTS_DATABASE["viscose-embroidered-shirt"];
  });

  // Async Fetch from MongoDB
  useEffect(() => {
    fetchAllProducts().then((all) => {
      const targetNorm = normalizeSlug(rawSlug);
      const found = all.find((p) => {
        if (p.slug === rawSlug || p.id === rawSlug) return true;
        const pNorm = normalizeSlug(p.slug);
        return pNorm === targetNorm || (targetNorm.includes("viscose") && pNorm.includes("viscose"));
      });

      if (found) {
        const orig = found.originalPrice || Math.round(found.price * 1.35);
        const discountPct = Math.round(((orig - found.price) / orig) * 100);
        setProductData({
          slug: found.slug,
          name: found.title,
          category: found.category || "CASUAL SHIRTS",
          price: found.price,
          originalPrice: orig,
          discount: `${discountPct}% OFF`,
          rating: 4.9,
          reviewsCount: 48,
          description: found.description || "Crafted from premium heavyweight fabric with signature FLIQ tailoring.",
          details: found.details && found.details.length > 0 ? found.details : [
            "100% Breathable Premium Viscose / Cotton construction",
            "Relaxed silhouette engineered for comfort",
            "Durable reinforced seam stitching"
          ],
          fabric: found.fabric || found.fabricGsm || "100% Premium Viscose Rayon",
          fabricGsm: found.fabricGsm || "160 GSM",
          fitProfile: found.fitProfile || "Relaxed Box Fit",
          hsnCode: found.hsnCode || "6109.10.00",
          images: found.images && found.images.length > 0 ? found.images : [found.image || "/images/shirt_viscose.png"],
          colors: found.colors && found.colors.length > 0 ? found.colors : [
            { name: "Cream Off-White", hex: "#FDFBF7" },
            { name: "Onyx Black", hex: "#09090B" }
          ],
          sizes: found.sizes && found.sizes.length > 0 ? found.sizes : ["S", "M", "L", "XL", "XXL"],
          stockQuantity: found.inventoryQuantity ?? 24
        });
      }
    });
  }, [rawSlug]);

  const product = productData;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Cream Off-White");
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || "M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(() => isProductWishlisted(product.slug));
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  useEffect(() => {
    setIsWishlisted(isProductWishlisted(product.slug));
    const handleUpdated = () => {
      setIsWishlisted(isProductWishlisted(product.slug));
    };
    const handleOpenReview = () => {
      setIsReviewModalOpen(true);
    };

    window.addEventListener("fliq_wishlist_updated", handleUpdated);
    window.addEventListener("fliq_open_review_modal", handleOpenReview);
    return () => {
      window.removeEventListener("fliq_wishlist_updated", handleUpdated);
      window.removeEventListener("fliq_open_review_modal", handleOpenReview);
    };
  }, [product.slug]);

  // Dynamic Verified Reviews State
  const [verifiedReviews, setVerifiedReviews] = useState<any[]>([
    {
      id: "rev_1",
      authorName: "Kabir M.",
      city: "Mumbai",
      rating: 5,
      fitSentiment: "TRUE_TO_SIZE",
      purchasedSize: "L",
      reviewTitle: "Best summer resort box fit shirt I own",
      reviewBody: "Fabric quality is insane. 160GSM viscose has a heavy silky drape that doesn't stick in humid weather. The Cuban collar sits flat and doesn't roll.",
      verifiedBuyer: true,
      createdAt: "2026-08-10T14:30:00.000Z"
    },
    {
      id: "rev_2",
      authorName: "Devansh R.",
      city: "Bengaluru",
      rating: 5,
      fitSentiment: "TRUE_TO_SIZE",
      purchasedSize: "M",
      reviewTitle: "Hand embroidery is crisp and premium",
      reviewBody: "Mother of pearl buttons add such a luxury tactile touch. Paired it with the cream straight chinos and got endless compliments.",
      verifiedBuyer: true,
      createdAt: "2026-08-08T11:20:00.000Z"
    },
    {
      id: "rev_3",
      authorName: "Aman V.",
      city: "Delhi NCR",
      rating: 5,
      fitSentiment: "RUNS_LARGE",
      purchasedSize: "XL",
      reviewTitle: "Proper streetwear drape",
      reviewBody: "Slightly oversized in the shoulders which is exactly what I wanted. Definitely stick to your true size for relaxed boxy fit.",
      verifiedBuyer: true,
      createdAt: "2026-08-02T09:15:00.000Z"
    }
  ]);

  // Fetch reviews from API
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/reviews/${product.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews && data.reviews.length > 0) {
          setVerifiedReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, [product.slug]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, product.images.length]);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (product.colors && product.colors[0]) {
      setSelectedColor(product.colors[0].name);
    }
    if (product.sizes && product.sizes[1]) {
      setSelectedSize(product.sizes[1]);
    }
  }, [product]);

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      image: product.images[0]
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="bg-white text-zinc-900 font-sans min-h-screen pb-16">

      {/* 1. FLIQ Breadcrumb Bar */}
      <div className="border-b border-zinc-200 bg-zinc-50/70 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center text-[12px] text-zinc-500 font-mono uppercase">
          <Link href="/" className="hover:text-acid hover:underline transition-colors">Home</Link>
          <span className="mx-2 text-zinc-400">&rsaquo;</span>
          <Link href="/shop" className="hover:text-acid hover:underline transition-colors">Shop</Link>
          <span className="mx-2 text-zinc-400">&rsaquo;</span>
          <Link href="/shop" className="hover:text-acid hover:underline transition-colors">Shirts</Link>
          <span className="mx-2 text-zinc-400">&rsaquo;</span>
          <span className="text-zinc-900 font-bold truncate max-w-sm">{product.category}</span>
        </div>
      </div>

      {/* 2. Main PDP Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================= LEFT: THUMBNAIL RAIL & CLEAN PRODUCT IMAGE (5 COLS) ================= */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:sticky lg:top-20">

            {/* Vertical Thumbnail Strip on desktop / Horizontal on mobile */}
            <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto no-scrollbar scrollbar-none sm:overflow-visible shrink-0 py-1 sm:py-0">
              {product.images.map((img, idx) => {
                const isActive = activeImageIdx === idx;
                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveImageIdx(idx)}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-12 h-14 sm:w-13 sm:h-16 rounded-md border transition-all cursor-pointer bg-white p-0.5 overflow-hidden shrink-0 ${
                      isActive
                        ? "border-zinc-900 ring-2 ring-zinc-900/20 shadow-xs"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover object-center rounded-xs"
                    />
                  </button>
                );
              })}
              {product.images.length > 3 && (
                <div className="w-12 h-14 sm:w-13 sm:h-16 rounded-md border border-zinc-200 bg-zinc-50 flex items-center justify-center text-[11px] font-mono text-zinc-500 shrink-0">
                  {product.images.length}+
                </div>
              )}
            </div>

            {/* Main Stage Image with Clean White Background & Zoom */}
            <div className="order-1 sm:order-2 w-full flex flex-col items-center">
              <div className="w-full relative rounded-xl border border-zinc-200 bg-white p-2 sm:p-4 flex items-center justify-center">
                {/* Featured Zoom Lens */}
                <ProductImageZoom
                  src={product.images[activeImageIdx]}
                  alt={product.name}
                  category={product.category}
                  onOpenFullscreen={() => setIsLightboxOpen(true)}
                />
              </div>

              {/* Click to see full view link */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="mt-2 text-xs text-zinc-600 hover:text-acid hover:underline cursor-pointer flex items-center gap-1 font-medium transition-colors"
              >
                <Maximize2 size={13} /> Click to see full view
              </button>
            </div>

          </div>

          {/* ================= RIGHT: PRODUCT SPECIFICATIONS & PURCHASING HUB (7 COLS) ================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Brand Store Link */}
            <div>
              <Link
                href="/shop"
                className="text-xs font-mono font-bold text-acid hover:underline inline-block uppercase tracking-wider"
              >
                Visit FLIQ Atelier Store
              </Link>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug mt-1">
                {product.name}
              </h1>

              {/* Ratings & Social Proof Bar */}
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-zinc-900">{product.rating}</span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <span className="text-zinc-300">|</span>

                <span className="text-zinc-600 hover:text-acid hover:underline cursor-pointer">
                  {product.reviewsCount.toLocaleString()} Verified Reviews
                </span>

                <span className="text-zinc-300">|</span>

                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  100+ units secured this drop
                </span>
              </div>
            </div>

            <hr className="border-zinc-200" />

            {/* Price Presentation */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-light text-red-600">
                  -{discountPercent || 31}%
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-zinc-900 tabular-nums tracking-tight font-(family-name:--font-inter)">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              <div className="text-xs text-zinc-500 font-normal font-(family-name:--font-inter) tabular-nums">
                M.R.P.: <span className="line-through">₹{product.originalPrice.toLocaleString()}</span>
              </div>

              <div className="text-xs text-zinc-600 mt-0.5 font-mono">
                Inclusive of all taxes (12% GST) • Free Express Shipping on orders over ₹1,999
              </div>
            </div>

            {/* 4 Feature Badges (FLIQ Atelier Theme) */}
            <div className="grid grid-cols-4 gap-2 py-3 border-y border-zinc-200 text-center text-[11px] font-medium text-zinc-700">
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <Truck size={18} className="text-acid group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-acid transition-colors">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <RefreshCw size={18} className="text-acid group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-acid transition-colors">30D Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <ShieldCheck size={18} className="text-acid group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-acid transition-colors">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <Award size={18} className="text-acid group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-acid transition-colors">Atelier Grade</span>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <span className="text-xs text-zinc-700 block mb-2 font-medium">
                Colour: <strong className="text-zinc-900">{selectedColor}</strong>
              </span>

              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  const isWhiteOrLight =
                    color.hex?.toLowerCase() === "#ffffff" ||
                    color.hex?.toLowerCase() === "#fdfbf7" ||
                    color.hex?.toLowerCase() === "#fafafa" ||
                    color.hex?.toLowerCase() === "#f5f5dc";
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`relative w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? "ring-2 ring-zinc-900 ring-offset-2 scale-105 shadow-2xs"
                          : "border border-zinc-300 hover:border-zinc-500 opacity-90 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          size={12}
                          className={isWhiteOrLight ? "text-zinc-900" : "text-white"}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-zinc-700 font-medium">
                  Size: <strong className="text-zinc-900">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-acid hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Ruler size={13} /> Size Chart
                </button>
              </div>

              <div className="flex items-center gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-8 px-3 rounded-md text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                          : "bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {selectedSize === "M" && (
                <p className="text-[11px] text-amber-700 font-bold mt-1.5 font-mono flex items-center gap-1">
                  <Zap size={11} /> Only 4 units remaining in Size M!
                </p>
              )}
            </div>

            {/* Quantity Selector & Standard Compact Button (FLIQ Theme) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Quantity Box */}
              <div className="flex items-center border border-zinc-300 rounded-md bg-zinc-50 overflow-hidden h-9">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-full text-zinc-600 hover:bg-zinc-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="px-3 h-full text-xs font-mono font-bold text-zinc-900 bg-white flex items-center justify-center min-w-7">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-7 h-full text-zinc-600 hover:bg-zinc-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>

              {/* Single Standard FLIQ Black Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className={`h-9 px-6 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-900 hover:bg-black text-white active:scale-[0.98]"
                }`}
              >
                <ShoppingBag size={14} />
                {added ? "Added to Bag ✓" : `Add to Bag`}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  const res = toggleCustomerWishlist(product.slug);
                  if (res.success && res.isWishlisted !== undefined) {
                    setIsWishlisted(res.isWishlisted);
                  }
                }}
                className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                  isWishlisted
                    ? "bg-red-50 text-red-500 border-red-200 shadow-2xs"
                    : "bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400"
                }`}
                title="Add to Wish List"
              >
                <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            <hr className="border-zinc-200 mt-2" />

            {/* Product Details Key-Value Table */}
            <div className="w-full">
              <h3 className="text-sm font-bold text-zinc-900 mb-2.5">Product details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs max-w-md">
                <span className="font-semibold text-zinc-600">Material composition</span>
                <span className="text-zinc-900 font-medium">{product.fabric}</span>

                <span className="font-semibold text-zinc-600">Pattern</span>
                <span className="text-zinc-900 font-medium">Embroidered Resort Motifs</span>

                <span className="font-semibold text-zinc-600">Fit type</span>
                <span className="text-zinc-900 font-medium">{product.fitProfile || "Relaxed Box Fit"}</span>

                <span className="font-semibold text-zinc-600">Collar style</span>
                <span className="text-zinc-900 font-medium">Cuban Notch Collar</span>

                <span className="font-semibold text-zinc-600">Country of Origin</span>
                <span className="text-zinc-900 font-medium">India</span>
              </div>
            </div>

            <hr className="border-zinc-200" />

            {/* About This Item Bullet List */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-2">About this item</h3>
              <ul className="list-disc list-outside ml-4 space-y-1.5 text-xs text-zinc-700 leading-relaxed">
                {product.details.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* ================= VERIFIED CUSTOMER REVIEWS & UGC ================= */}
        <div className="mt-14 pt-8 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                Verified Collector Reviews ({verifiedReviews.length})
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Real customer fit assessments &amp; fabric feedback
              </p>
            </div>

            <button
              onClick={() => {
                if (!isCustomerAuthenticated()) {
                  window.dispatchEvent(
                    new CustomEvent("fliq_auth_required", {
                      detail: { action: "review", productSlug: product.slug }
                    })
                  );
                } else {
                  setIsReviewModalOpen(true);
                }
              }}
              className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto transition-all"
            >
              <MessageSquarePlus size={14} />
              Write a Review
            </button>
          </div>

          {/* Fit Sentiment Meter & Summary */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 sm:p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-zinc-900 font-(family-name:--font-inter) tabular-nums">
                4.9
              </div>
              <div>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 mt-0.5 block">
                  100% Recommended
                </span>
              </div>
            </div>

            {/* Fit Feedback Distribution Bar */}
            <div className="md:col-span-2 flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-600 font-bold">
                <span>Fit Profile</span>
                <span className="text-emerald-700">92% True to Size</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden flex">
                <div className="bg-zinc-400 h-full w-[4%]" title="Runs Small (4%)"></div>
                <div className="bg-zinc-900 h-full w-[92%]" title="True to Size (92%)"></div>
                <div className="bg-zinc-400 h-full w-[4%]" title="Runs Large (4%)"></div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                <span>Runs Small</span>
                <span className="text-zinc-700">True to Size (Relaxed)</span>
                <span>Runs Oversized</span>
              </div>
            </div>
          </div>

          {/* Reviews Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {verifiedReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-zinc-200 bg-white shadow-2xs flex flex-col justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      VERIFIED BUYER
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 mb-1">
                    {rev.reviewTitle}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-4">
                    &ldquo;{rev.reviewBody}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="font-bold text-zinc-700">{rev.authorName} ({rev.city})</span>
                  <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-bold">
                    Size {rev.purchasedSize}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= COMPLETE THE LOOK ================= */}
        <div className="mt-14 pt-8 border-t border-zinc-200">
          <h2 className="text-lg font-bold text-zinc-900 mb-6">
            Customers who viewed this item also viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                id: "ctl_1",
                slug: "cream-straight-fit-chinos",
                title: "Cream Straight Fit Utility Chinos",
                price: 1599,
                originalPrice: 2199,
                image: "/images/chinos_cream.png",
                tag: "PERFECT MATCH"
              },
              {
                id: "ctl_2",
                slug: "touch-grass-knit-polo",
                title: "Touch Grass Club Embroidered Polo T-Shirt",
                price: 1499,
                originalPrice: 1999,
                image: "/images/polo_knit.png",
                tag: "HOT"
              },
              {
                id: "ctl_3",
                slug: "distortion-hoodie",
                title: "Distortion Oversized Heavyweight Hoodie",
                price: 3499,
                originalPrice: 4499,
                image: "/images/product_distortion.png",
                tag: "DROP 03"
              },
              {
                id: "ctl_4",
                slug: "brown-regular-fit-shirt",
                title: "Brown Regular Fit Linen Shirt",
                price: 1299,
                originalPrice: 1799,
                image: "/images/shirt_brown.png"
              }
            ].map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>

      </div>

      {/* ================= SIZE GUIDE MODAL ================= */}
      {isSizeGuideOpen && (
        <SizeGuideModal
          category={product.category}
          onClose={() => setIsSizeGuideOpen(false)}
        />
      )}

      {/* ================= WRITE REVIEW MODAL ================= */}
      {isReviewModalOpen && (
        <WriteReviewModal
          productSlug={product.slug}
          productName={product.name}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewSubmitted={(newRev) => setVerifiedReviews((prev) => [newRev, ...prev])}
        />
      )}

      {/* ================= WAITLIST MODAL ================= */}
      {isWaitlistModalOpen && (
        <WaitlistModal
          productSlug={product.slug}
          productTitle={product.name}
          selectedSize={selectedSize}
          onClose={() => setIsWaitlistModalOpen(false)}
        />
      )}

      {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-99999 bg-zinc-950/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between text-white/90 border-b border-white/10 pb-3 z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                FLIQ GALLERY
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-white">
                {activeImageIdx + 1} / {product.images.length}
              </span>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="flex items-center gap-1.5 text-xs font-mono text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Close Fullscreen (ESC)"
            >
              <span>Close</span>
              <span className="text-[10px] text-zinc-400 bg-black/40 px-1 rounded">ESC</span>
              <X size={16} className="ml-1" />
            </button>
          </div>

          {/* Central Main Stage Image + Navigation Chevrons */}
          <div className="relative w-full flex-1 flex items-center justify-center py-2 my-auto">
            {/* Previous Image Chevron */}
            {product.images.length > 1 && (
              <button
                onClick={() =>
                  setActiveImageIdx((prev) =>
                    prev > 0 ? prev - 1 : product.images.length - 1
                  )
                }
                className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Previous Image (←)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* High-Resolution Viewport */}
            <div className="relative w-full max-w-4xl h-[65vh] sm:h-[75vh]">
              <Image
                src={product.images[activeImageIdx]}
                alt={product.name}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Next Image Chevron */}
            {product.images.length > 1 && (
              <button
                onClick={() =>
                  setActiveImageIdx((prev) =>
                    prev < product.images.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Next Image (→)"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Navigation Bar */}
          <div className="flex justify-center items-center gap-2 pt-3 border-t border-white/10 z-10 overflow-x-auto">
            {product.images.map((img, idx) => {
              const isSelected = activeImageIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-12 h-14 sm:w-14 sm:h-18 rounded-md overflow-hidden relative border-2 transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "border-white ring-2 ring-white/30 scale-105 shadow-xl"
                      : "border-white/20 opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
