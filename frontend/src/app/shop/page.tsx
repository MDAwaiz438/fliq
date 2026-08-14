"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Filter, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import {
  ProductItem,
  getAllProductsSync,
  fetchAllProducts,
  CategoryItem,
  getAllCategoriesSync
} from "@/lib/products";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [products, setProducts] = useState<ProductItem[]>(() => getAllProductsSync());
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => getAllCategoriesSync());

  // Carousel navigation & drag state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    setProducts(getAllProductsSync());
    setCategoriesList(getAllCategoriesSync());
    fetchAllProducts().then((latest) => setProducts(latest));

    const handleUpdated = () => {
      setProducts(getAllProductsSync());
      setCategoriesList(getAllCategoriesSync());
      fetchAllProducts().then((latest) => setProducts(latest));
    };

    window.addEventListener("fliq_products_updated", handleUpdated);
    window.addEventListener("fliq_categories_updated", handleUpdated);
    return () => {
      window.removeEventListener("fliq_products_updated", handleUpdated);
      window.removeEventListener("fliq_categories_updated", handleUpdated);
    };
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categoriesList, products]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const allCategoryNames = [
    "ALL",
    ...Array.from(
      new Set([
        ...categoriesList.map((c) => c.name.toUpperCase()),
        ...products.map((p) => (p.category ? p.category.toUpperCase() : "")).filter(Boolean)
      ])
    )
  ];

  const featuredCategories = categoriesList.filter((c) => c.isFeatured);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "ALL") return true;
    const pCat = p.category ? p.category.toUpperCase() : "";
    const sel = selectedCategory.toUpperCase();
    return pCat === sel || pCat.includes(sel) || sel.includes(pCat);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-20 font-sans select-none">

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-wider block mb-1">
            STREETWEAR ATELIER
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 uppercase">
            GARMENT CATALOG
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono uppercase text-zinc-500 text-xs font-bold tracking-wider">SORT:</span>
          <button className="flex items-center gap-2 font-mono font-bold uppercase bg-white px-3 py-2 border border-zinc-300 text-xs rounded-lg shadow-2xs cursor-pointer hover:border-zinc-900 transition-colors">
            NEWEST RELEASES <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Featured Categories Carousel with Left/Right Chevrons & Edge Fade */}
      {featuredCategories.length > 0 && (
        <div className="relative mb-8 group">
          {/* Left Arrow Controller */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-zinc-300 shadow-md hidden sm:flex items-center justify-center text-zinc-700 hover:text-black hover:bg-zinc-50 hover:scale-105 transition-all cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Left Gradient Edge Mask */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-linear-to-r from-white via-white/80 to-transparent pointer-events-none z-10 hidden sm:block" />
          )}

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="overflow-x-auto no-scrollbar scrollbar-none py-1 scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex items-center gap-2.5 min-w-max px-0.5">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                  selectedCategory === "ALL"
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                <Layers size={13} />
                <span>ALL COLLECTIONS</span>
              </button>

              {featuredCategories.map((cat) => {
                const isSelected = selectedCategory.toUpperCase() === cat.name.toUpperCase();

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                      isSelected
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-md overflow-hidden relative shrink-0 border border-zinc-200">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                    </div>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Gradient Edge Mask */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-linear-to-l from-white via-white/80 to-transparent pointer-events-none z-10 hidden sm:block" />
          )}

          {/* Right Arrow Controller */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-zinc-300 shadow-md hidden sm:flex items-center justify-center text-zinc-700 hover:text-black hover:bg-zinc-50 hover:scale-105 transition-all cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {/* Main Grid & Filters */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-60 shrink-0 flex flex-col gap-6 bg-white p-5 border border-zinc-200 rounded-2xl shadow-2xs h-fit">
          <div>
            <h3 className="font-mono font-bold uppercase mb-3 text-xs tracking-wider text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-1.5">
              <Filter size={14} className="text-acid" /> ALL CATEGORIES
            </h3>
            <ul className="flex flex-col gap-1 text-xs font-mono font-bold uppercase">
              {allCategoryNames.map((cat) => {
                const count =
                  cat === "ALL"
                    ? products.length
                    : products.filter((p) => {
                        if (!p.category) return false;
                        const c = p.category.toUpperCase();
                        return c === cat || c.includes(cat) || cat.includes(c);
                      }).length;

                const isSelected = selectedCategory.toUpperCase() === cat.toUpperCase();

                return (
                  <li
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-zinc-900 text-white shadow-xs"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-75 font-normal">({count})</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-500 font-mono text-xs border border-zinc-200 rounded-2xl bg-zinc-50">
              No garments found matching &quot;{selectedCategory}&quot;.
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
