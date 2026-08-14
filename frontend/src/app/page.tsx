"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import {
  ProductItem,
  CategoryItem,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  getAllProductsSync,
  getAllCategoriesSync,
  fetchAllProducts
} from "@/lib/products";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [curatedProducts, setCuratedProducts] = useState<ProductItem[]>(() => INITIAL_PRODUCTS);
  const [dynamicCategories, setDynamicCategories] = useState<CategoryItem[]>(() => INITIAL_CATEGORIES);

  const heroSlides = [
    {
      id: "slide_1",
      title: "DISTORTION DROP 03",
      subtitle: "RAW INDUSTRIAL STREETWEAR",
      image: "/images/urban_hero_landscape.png",
      link: "/shop"
    },
    {
      id: "slide_2",
      title: "CYBERPUNK ESSENTIALS",
      subtitle: "HEAVYWEIGHT 450GSM COTTON",
      image: "/images/hero_landscape.png",
      link: "/shop"
    },
    {
      id: "slide_3",
      title: "FLIQ ATELIER 2026",
      subtitle: "LIMITED RUN // 100 PIECES",
      image: "/images/editorial_landscape.png",
      link: "/shop"
    }
  ];

  const featuredCategories = dynamicCategories
    .filter((c) => c.isFeatured)
    .map((cat) => {
      const cleanCat = cat.name.toUpperCase();
      const count = curatedProducts.filter((p) => {
        if (!p.category) return false;
        const c = p.category.toUpperCase();
        return c === cleanCat || c.includes(cleanCat) || cleanCat.includes(c);
      }).length;

      return {
        id: cat.id,
        title: cat.name,
        subtitle: cat.subtitle || "ATELIER COLLECTION",
        count: `${count} ${count === 1 ? "ITEM" : "ITEMS"}`,
        image: cat.image || "/images/shirt_viscose.png",
        highlightTag: cat.highlightTag,
        link: `/shop/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
      };
    });

  useEffect(() => {
    setCuratedProducts(getAllProductsSync());
    setDynamicCategories(getAllCategoriesSync());
    fetchAllProducts().then((latest) => setCuratedProducts(latest));

    const handleUpdated = () => {
      setCuratedProducts(getAllProductsSync());
      setDynamicCategories(getAllCategoriesSync());
      fetchAllProducts().then((latest) => setCuratedProducts(latest));
    };

    window.addEventListener("fliq_products_updated", handleUpdated);
    window.addEventListener("fliq_categories_updated", handleUpdated);
    return () => {
      window.removeEventListener("fliq_products_updated", handleUpdated);
      window.removeEventListener("fliq_categories_updated", handleUpdated);
    };
  }, []);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="flex flex-col min-h-screen bg-white text-bone font-body selection:bg-acid selection:text-white">

      {/* Urban Monkey Style Hero Carousel */}
      <section className="relative w-full h-[75vh] sm:h-[82vh] lg:h-[88vh] bg-black overflow-hidden border-b border-bone group">

        {/* 16:9 Landscape Widescreen Hero Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-0 bg-black"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover object-[center_20%]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Left Arrow Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer opacity-70 group-hover:opacity-100"
          title="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer opacity-70 group-hover:opacity-100"
          title="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Left-Aligned Clean Hero Text & Button */}
        <div className="absolute bottom-10 sm:bottom-14 left-6 sm:left-14 lg:left-20 z-20 max-w-xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-start text-left"
            >
              <span className="text-xs font-mono font-bold text-white uppercase tracking-[0.2em] mb-2">
                {slide.subtitle}
              </span>

              {/* Signature Display Title */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white tracking-wide uppercase italic mb-5 leading-none">
                {slide.title}
              </h1>

              {/* White Pill CTA Button */}
              <Link href={slide.link}>
                <button className="bg-white text-bone font-heading font-bold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-acid hover:text-white transition-all text-xs sm:text-sm cursor-pointer transform hover:scale-105 flex items-center gap-2">
                  SHOP NOW <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center gap-2 mt-6">
            {heroSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

      </section>

      {/* Infinite Ticker Bar — Solid Black */}
      <div className="bg-bone text-white py-3.5 overflow-hidden flex whitespace-nowrap shadow-xs border-y border-bone">
        <motion.div
          className="font-heading font-bold uppercase text-xs tracking-[0.08em] flex gap-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-8 items-center">
              <span className="flex items-center gap-2"><Truck size={14} className="text-acid" /> FREE INDIA SHIPPING OVER ₹3,000</span>
              <span>&middot;</span>
              <span>LIMITED DROP CULTURE</span>
              <span>&middot;</span>
              <span className="flex items-center gap-2"><Sparkles size={14} className="text-acid" /> HEAVYWEIGHT 450GSM COTTON</span>
              <span>&middot;</span>
              <span>SHIPROCKET EXPRESS DELIVERY</span>
              <span>&middot;</span>
              <span>30-DAY EASY RETURNS</span>
              <span>&middot;</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* FEATURED CATEGORY SECTION — Strict 6/2 Grid (6 Desktop, 2 Mobile) */}
      <section className="py-20 max-w-(--content-max) mx-auto px-(--content-pad-x) w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-bone pb-4 mb-10 gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider block text-acid">CATEGORIES</span>
            <h2 className="font-display text-4xl sm:text-5xl tracking-[0.02em] uppercase text-bone">
              FEATURED CATEGORY
            </h2>
          </div>
          <Link href="/shop" className="font-heading font-bold text-xs hover:underline uppercase tracking-wider flex items-center gap-1 text-bone">
            EXPLORE ALL CATEGORIES &rarr;
          </Link>
        </div>

        {/* 6/2 Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.link}
              className="group relative aspect-3/4 overflow-hidden rounded-xs block border border-zinc-200 bg-obsidian shadow-xs"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent opacity-90" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col justify-end">
                <span suppressHydrationWarning className="text-[10px] font-mono text-zinc-300 block mb-0.5">
                  {cat.count}
                </span>
                <h3 className="font-heading font-bold text-xs sm:text-sm tracking-wider uppercase leading-tight group-hover:text-acid transition-colors">
                  {cat.title}
                </h3>
                <span className="text-[9px] font-mono text-zinc-400 uppercase mt-0.5 truncate">{cat.subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CURATED STREETWEAR SECTION — Strict 6/2 Grid (6 Desktop, 2 Mobile) */}
      <section className="py-20 bg-white border-y border-bone">
        <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) w-full">
          <div className="flex justify-between items-end mb-10 border-b border-bone pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block text-acid">NEW ARRIVALS</span>
              <h2 className="font-display text-4xl sm:text-5xl tracking-[0.02em] uppercase text-bone">
                CURATED STREETWEAR
              </h2>
            </div>
            <Link href="/shop" className="font-heading font-bold text-xs hover:underline uppercase tracking-wider flex items-center gap-1 text-bone">
              SHOP ALL PRODUCTS &rarr;
            </Link>
          </div>

          {/* Strict 6/2 Grid (6 Desktop, 2 Mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-3.5 gap-y-8">
            {curatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Manifesto */}
      <section className="border-b border-bone">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[55vh] max-w-(--content-max) mx-auto">
          <div className="relative h-80 md:h-auto min-h-[40vh]">
            <Image
              src="/images/urban_hero_landscape.png"
              alt="Editorial"
              fill
              className="object-cover object-[center_20%]"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-16 text-left bg-white">
            <span className="text-xs font-mono font-bold uppercase tracking-wider mb-2 text-acid">OUR MANIFESTO</span>
            <h2 className="font-display text-4xl sm:text-6xl tracking-[0.02em] leading-[0.9] uppercase mb-6 text-bone">
              NOT MADE FOR THE MASSES.
            </h2>
            <p className="font-body leading-relaxed mb-8 max-w-md text-sm sm:text-base text-zinc-600">
              Every drop is a limited statement piece designed in India. We reject mass production and endless restocks. Once a piece is gone, it enters our archive forever.
            </p>
            <div>
              <Link href="/about">
                <button className="bg-bone text-white font-heading font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors text-xs cursor-pointer">READ OUR STORY &rarr;</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Feature Guarantees */}
      <section className="py-16 bg-white border-b border-bone">
        <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <div className="flex flex-col gap-2">
            <span className="w-10 h-10 rounded-full bg-blue-50 text-acid border border-blue-200 flex items-center justify-center mb-2">
              <Sparkles size={20} />
            </span>
            <h4 className="font-heading font-bold text-sm uppercase text-bone">SCARCE DROPS</h4>
            <p className="text-xs leading-relaxed text-zinc-500">Limited batch releases with unique serial tags and zero restocks.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="w-10 h-10 rounded-full bg-blue-50 text-acid border border-blue-200 flex items-center justify-center mb-2">
              <ShieldCheck size={20} />
            </span>
            <h4 className="font-heading font-bold text-sm uppercase text-bone">PREMIUM MATERIALS</h4>
            <p className="text-xs leading-relaxed text-zinc-500">450gsm French Terry cotton and custom acid-wash finishes.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="w-10 h-10 rounded-full bg-blue-50 text-acid border border-blue-200 flex items-center justify-center mb-2">
              <Truck size={20} />
            </span>
            <h4 className="font-heading font-bold text-sm uppercase text-bone">SHIPROCKET LOGISTICS</h4>
            <p className="text-xs leading-relaxed text-zinc-500">Fast nationwide delivery via Delhivery and BlueDart Express.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="w-10 h-10 rounded-full bg-blue-50 text-acid border border-blue-200 flex items-center justify-center mb-2">
              <RefreshCw size={20} />
            </span>
            <h4 className="font-heading font-bold text-sm uppercase text-bone">EASY RETURNS</h4>
            <p className="text-xs leading-relaxed text-zinc-500">Hassle-free 30-day return policy and instant store credit.</p>
          </div>
        </div>
      </section>

      {/* Email Drop Access */}
      <section className="py-20 max-w-(--content-max) mx-auto px-(--content-pad-x) w-full text-center">
        <div className="max-w-2xl mx-auto bg-obsidian p-8 sm:p-12 border border-bone rounded-sm shadow-xs">
          <span className="text-xs font-mono font-bold uppercase tracking-wider block mb-2 text-acid">EARLY ACCESS</span>
          <h2 className="font-display text-4xl sm:text-5xl tracking-[0.02em] mb-3 text-bone">
            NEXT DROP INBOUND.
          </h2>
          <p className="font-body text-xs sm:text-sm mb-8 max-w-md mx-auto text-zinc-600">
            Get exclusive private access code 1 hour before the next drop opens to the public.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 mb-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 bg-white border border-bone rounded-sm px-4 py-3 font-mono text-xs outline-none focus:border-acid transition-colors placeholder:uppercase placeholder:tracking-wider text-bone"
              required
            />
            <button type="submit" className="bg-bone text-white font-heading font-bold uppercase px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors text-xs cursor-pointer">JOIN VIP LIST</button>
          </form>
          <p className="text-[11px] font-mono text-zinc-500">No spam. Only drop access codes.</p>
        </div>
      </section>

    </div>
  );
}
