"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { saveProductToStorage, getAllCategoriesSync } from "@/lib/products";
import { BACKEND_URL } from "@/lib/api";
import {
  ArrowLeft,
  Upload,
  Trash2,
  CheckCircle,
  Save,
  X,
  Smartphone,
  Check,
  Palette,
  Camera
} from "lucide-react";

interface ColorSwatch {
  name: string;
  hex: string;
}

export const STANDARD_INDUSTRY_COLORS: { name: string; hex: string; category: string }[] = [
  // Core Neutrals
  { name: "Onyx Black", hex: "#09090B", category: "Core Neutrals" },
  { name: "Optical White", hex: "#FFFFFF", category: "Core Neutrals" },
  { name: "Heather Grey", hex: "#9CA3AF", category: "Core Neutrals" },
  { name: "Charcoal Grey", hex: "#374151", category: "Core Neutrals" },
  { name: "Cream Off-White", hex: "#FDFBF7", category: "Core Neutrals" },
  
  // Blues & Cool
  { name: "Midnight Navy", hex: "#0F172A", category: "Blues & Cool" },
  { name: "Cobalt Blue", hex: "#2563EB", category: "Blues & Cool" },
  { name: "Steel Blue", hex: "#475569", category: "Blues & Cool" },
  { name: "Sky Blue", hex: "#38BDF8", category: "Blues & Cool" },
  
  // Earth & Greens
  { name: "Olive Army Green", hex: "#3F4F38", category: "Earth & Greens" },
  { name: "Forest Green", hex: "#14532D", category: "Earth & Greens" },
  { name: "Sage Mist", hex: "#84A98C", category: "Earth & Greens" },
  { name: "Sand Khaki", hex: "#D4C5B9", category: "Earth & Greens" },
  { name: "Mocha Brown", hex: "#5C4033", category: "Earth & Greens" },
  
  // Warm & Accents
  { name: "Vintage Maroon", hex: "#881337", category: "Warm & Accents" },
  { name: "Crimson Red", hex: "#DC2626", category: "Warm & Accents" },
  { name: "Terracotta Rust", hex: "#C2410C", category: "Warm & Accents" },
  { name: "Mustard Gold", hex: "#CA8A04", category: "Warm & Accents" },
  { name: "Dusty Rose", hex: "#DDA7A5", category: "Warm & Accents" },
];

interface ProductEditorViewProps {
  initialProduct?: any | null;
  onBack: () => void;
  onSave: (productData: any) => void;
}

export default function ProductEditorView({
  initialProduct,
  onBack,
  onSave
}: ProductEditorViewProps) {
  const isEditing = Boolean(initialProduct);

  // Form State
  const [title, setTitle] = useState(initialProduct?.title || "");
  const [description, setDescription] = useState(
    initialProduct?.description || ""
  );
  const [category, setCategory] = useState(initialProduct?.category || "Apparel > Hoodies & Sweatshirts");
  const [tags, setTags] = useState<string[]>(
    initialProduct?.tags || ["FW26 Drop", "Streetwear Luxe", "Limited Edition"]
  );
  const [newTagInput, setNewTagInput] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  // Pricing
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : ""
  );
  const [costPerItem, setCostPerItem] = useState("1100");

  // Standard Industry Colors (Default is Onyx Black)
  const [colors, setColors] = useState<ColorSwatch[]>(() => {
    if (initialProduct?.colors && Array.isArray(initialProduct.colors) && initialProduct.colors.length > 0) {
      return initialProduct.colors;
    }
    return [{ name: "Onyx Black", hex: "#09090B" }];
  });

  const [colorCategoryFilter, setColorCategoryFilter] = useState<string>("ALL");

  // Key Feature Bullet Highlights (For PDP DETAILS accordion)
  const [details, setDetails] = useState<string[]>(
    initialProduct?.details || [
      "450GSM Heavyweight Loopback 100% Cotton",
      "Signature raw-edge seam distress tailoring",
      "Double-layered oversized streetwear hood",
      "Cold gentle machine wash inside out"
    ]
  );
  const [newDetailInput, setNewDetailInput] = useState("");

  // Technical Specs & Care
  const [fabricGsm, setFabricGsm] = useState(initialProduct?.fabricGsm || "450 GSM Heavyweight Loopback");
  const [fitProfile, setFitProfile] = useState(initialProduct?.fitProfile || "Boxy Oversized / Drop Shoulder");
  const [hsnCode, setHsnCode] = useState(initialProduct?.hsnCode || "6109.10.00");
  const [careInstructions, setCareInstructions] = useState(
    initialProduct?.careInstructions || "Machine wash cold inside out, cool iron on reverse. Do not tumble dry."
  );

  // Drag & Drop Image Gallery (Max 5 Images)
  const MAX_IMAGES = 5;
  const existingImages: string[] = initialProduct?.images || (initialProduct?.image ? [initialProduct.image] : []);
  
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (existingImages.length > 0) {
      return existingImages.slice(0, MAX_IMAGES);
    }
    return ["/images/product_distortion.png"];
  });

  const [isDraggingZone, setIsDraggingZone] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Variant Matrix
  const [variants, setVariants] = useState([
    { size: "S", sku: `FLQ-${Date.now().toString().slice(-3)}-S`, inventory: "15", price: price || "3499" },
    { size: "M", sku: `FLQ-${Date.now().toString().slice(-3)}-M`, inventory: "30", price: price || "3499" },
    { size: "L", sku: `FLQ-${Date.now().toString().slice(-3)}-L`, inventory: "25", price: price || "3499" },
    { size: "XL", sku: `FLQ-${Date.now().toString().slice(-3)}-XL`, inventory: "10", price: price || "3499" },
  ]);

  const [loading, setLoading] = useState(false);

  // Profit Margins
  const priceNum = parseFloat(price) || 0;
  const costNum = parseFloat(costPerItem) || 0;
  const profitAmt = Math.max(0, priceNum - costNum);
  const profitMarginPct = priceNum > 0 ? ((profitAmt / priceNum) * 100).toFixed(0) : "0";

  // Total stock
  const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.inventory) || 0), 0);

  // Process and append multiple image files (up to max 5)
  const processImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    const availableSlots = MAX_IMAGES - imageUrls.length;
    if (availableSlots <= 0) {
      alert("Maximum 5 images allowed per product.");
      return;
    }

    const filesToUpload = validFiles.slice(0, availableSlots);

    filesToUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          setImageUrls((prev) => {
            if (prev.length >= MAX_IMAGES) return prev;
            return [...prev, dataUrl];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingZone(false);
    if (e.dataTransfer.files) {
      processImageFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (imageUrls.length >= MAX_IMAGES) {
      alert("Maximum 5 images allowed per product.");
      return;
    }
    setImageUrls([...imageUrls, trimmed]);
    setUrlInput("");
  };

  const handleDeleteImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = imageUrls[index];
    const remaining = imageUrls.filter((_, i) => i !== index);
    setImageUrls([item, ...remaining]);
  };

  // Standard Industry Color Toggle
  const toggleStandardColor = (stdColor: { name: string; hex: string }) => {
    const exists = colors.some((c) => c.name === stdColor.name);
    if (exists) {
      if (colors.length === 1) {
        alert("A garment must have at least 1 primary color.");
        return;
      }
      setColors(colors.filter((c) => c.name !== stdColor.name));
    } else {
      setColors([...colors, { name: stdColor.name, hex: stdColor.hex }]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) {
        setTags([...tags, newTagInput.trim()]);
      }
      setNewTagInput("");
    }
  };

  const handleAddDetail = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newDetailInput.trim()) {
      e.preventDefault();
      setDetails([...details, newDetailInput.trim()]);
      setNewDetailInput("");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Please enter a garment title!");

    const validImages = imageUrls.filter(Boolean);
    if (validImages.length === 0) {
      return alert("Please provide at least 1 image for the product.");
    }

    setLoading(true);

    const productPayload = {
      id: initialProduct?.id || `prod_${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description,
      price: priceNum || 3499,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      category,
      tags,
      colors,
      details,
      careInstructions,
      fabricGsm,
      fitProfile,
      hsnCode,
      images: validImages.length > 0 ? validImages : ["/images/product_distortion.png"],
      image: validImages[0] || "/images/product_distortion.png",
      inventoryQuantity: totalStock,
      sku: variants[0]?.sku || `FLQ-${Date.now().toString().slice(-4)}`,
      status: isOnline ? "PUBLISHED" : "DRAFT",
      syncStatus: "SYNCED",
      lastSyncedAt: "Just now"
    };

    try {
      saveProductToStorage(productPayload as any);
      await fetch(`${BACKEND_URL}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload)
      });
    } catch (err) {
      console.warn("Saved to client state:", err);
    }

    setLoading(false);
    onSave(productPayload);
  };

  const primaryHeroUrl = imageUrls[0] || "";
  const filteredStandardColors =
    colorCategoryFilter === "ALL"
      ? STANDARD_INDUSTRY_COLORS
      : STANDARD_INDUSTRY_COLORS.filter((c) => c.category === colorCategoryFilter);

  return (
    <div
      className="flex flex-col gap-6 max-w-6xl mx-auto pb-16 animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          processImageFiles(e.target.files);
        }}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* ================= HEADER BAR ================= */}
      <div className="flex items-center justify-between py-2 border-b border-zinc-200/80">
        <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 hover:text-zinc-900 cursor-pointer transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Product Creation</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="h-8 px-3.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="h-8 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Save size={13} />
            <span>{loading ? "Publishing..." : isEditing ? "Save Changes" : "Publish Product"}</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN STUDIO 2-COLUMN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ================= LEFT MAIN CANVAS (66%) ================= */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* 1. Product Details & Media Studio Card */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
            <h2 className="text-base font-bold text-zinc-900">Product Details</h2>

            {/* Product Title Input */}
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Garment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distortion Oversized Heavyweight Hoodie"
                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Story & Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe garment fabric, silhouette, loopback weave, and drop aesthetic..."
                className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 resize-y placeholder:text-zinc-400"
              />
            </div>

            {/* ================= DRAG & DROP MEDIA UPLOADER (MAX 5 IMAGES) ================= */}
            <div className="flex flex-col gap-3.5 pt-2">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    Product Imagery & Gallery
                  </label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-zinc-500">Upload up to 5 photos. Drag & drop images directly or browse.</span>
                    <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      1200 × 1500 px (4:5 Ratio)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      imageUrls.length >= MAX_IMAGES
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200"
                    }`}
                  >
                    {imageUrls.length} / {MAX_IMAGES} Images
                  </span>
                  {imageUrls.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setImageUrls([])}
                      className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Drag & Drop Upload Zone (Shown when under 5 images) */}
              {imageUrls.length < MAX_IMAGES ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingZone(true);
                  }}
                  onDragLeave={() => setIsDraggingZone(false)}
                  onDrop={handleDropFiles}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                    isDraggingZone
                      ? "border-blue-500 bg-blue-50/70 ring-4 ring-blue-500/10 scale-[1.01]"
                      : "border-zinc-300 bg-zinc-50/60 hover:bg-zinc-50 hover:border-zinc-400"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-xs">
                    <Upload size={20} className={isDraggingZone ? "text-blue-500 animate-bounce" : ""} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      {isDraggingZone ? "Drop Images Here" : "Drag & drop garment photos here, or browse files"}
                    </span>
                    <span className="text-[11px] text-zinc-500 mt-0.5 block">
                      Recommended: <strong>1200 × 1500 px</strong> (4:5 Portrait) • Supports PNG, JPG, WebP
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                    {MAX_IMAGES - imageUrls.length} slot{MAX_IMAGES - imageUrls.length > 1 ? "s" : ""} remaining
                  </span>
                </div>
              ) : (
                <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-3 flex items-center justify-between text-xs text-zinc-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                    <span className="font-semibold">Maximum {MAX_IMAGES} images uploaded.</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">Delete an image below to upload a different one.</span>
                </div>
              )}

              {/* URL Direct Add Bar */}
              {imageUrls.length < MAX_IMAGES && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddUrlImage();
                      }
                    }}
                    placeholder="Or paste direct image URL (e.g. /images/hoodie_front.png)..."
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="h-8 px-3.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              )}

              {/* Uploaded Images Gallery Strip */}
              {imageUrls.length > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Uploaded Gallery ({imageUrls.length}/{MAX_IMAGES})
                    </span>
                    <span className="text-[10px] text-zinc-400">Click photo to zoom preview</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {imageUrls.map((url, idx) => {
                      const isPrimary = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col gap-1.5 border rounded-xl p-2 transition-all relative ${
                            isPrimary
                              ? "border-zinc-900 bg-zinc-900/5 shadow-xs ring-1 ring-zinc-900/10"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                          }`}
                        >
                          {/* Image Card Header */}
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-zinc-700">
                              {isPrimary ? "Photo 1 (Cover)" : `Photo ${idx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(idx)}
                              className="text-zinc-400 hover:text-red-600 cursor-pointer p-0.5"
                              title="Delete this image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Image Preview Container */}
                          <div
                            onClick={() => setPreviewImageUrl(url)}
                            className="w-full aspect-4/5 bg-zinc-100 rounded-lg overflow-hidden relative border border-zinc-200 group cursor-pointer"
                            title="Click to zoom preview"
                          >
                            <Image src={url} alt={`Garment photo ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" />
                            {isPrimary && (
                              <div className="absolute top-1.5 left-1.5 bg-zinc-900/90 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full tracking-wider shadow-xs backdrop-blur-xs">
                                PRIMARY COVER
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1.5">
                              <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded shadow-xs">
                                Zoom Preview
                              </span>
                              {!isPrimary && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetPrimary(idx);
                                  }}
                                  className="px-2 py-1 bg-white text-zinc-900 text-[10px] font-bold rounded shadow-xs cursor-pointer hover:bg-zinc-100"
                                >
                                  Set as Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteImage(idx);
                                }}
                                className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded shadow-xs cursor-pointer hover:bg-red-700 flex items-center gap-1"
                              >
                                <Trash2 size={10} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ================= STANDARD INDUSTRY COLORS ONLY (NO MANUAL SYSTEM) ================= */}
            <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette size={14} className="text-zinc-700" /> Standard Industry Garment Colors
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    Select from standard apparel color palette. Generates instant interactive swatches on storefront PDP.
                  </span>
                </div>

                {/* Category Filters */}
                <div className="flex bg-zinc-100 p-0.5 rounded-lg text-[10px] font-semibold gap-0.5 self-start sm:self-auto">
                  {["ALL", "Core Neutrals", "Blues & Cool", "Earth & Greens", "Warm & Accents"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setColorCategoryFilter(cat)}
                      className={`px-2 py-1 rounded cursor-pointer transition-all ${
                        colorCategoryFilter === cat
                          ? "bg-white text-zinc-900 shadow-xs font-bold"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Selected Colors Bar */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-800">
                    Active Product Colors ({colors.length} selected)
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Click swatches below to toggle on / off
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {colors.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white shadow-xs"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-300 shrink-0 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-bold text-zinc-900">{c.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{c.hex}</span>
                      <button
                        type="button"
                        onClick={() => toggleStandardColor(c)}
                        className="text-zinc-400 hover:text-red-600 cursor-pointer ml-1"
                        title="Remove Color"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standard Industry Swatches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                {filteredStandardColors.map((std) => {
                  const isSelected = colors.some((c) => c.name === std.name);
                  return (
                    <button
                      key={std.name}
                      type="button"
                      onClick={() => toggleStandardColor(std)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-xs ring-1 ring-zinc-900"
                          : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <span
                          className="w-6 h-6 rounded-full border border-zinc-300 block shadow-xs"
                          style={{ backgroundColor: std.hex }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                            <Check size={12} className={std.hex === "#FFFFFF" || std.hex === "#FDFBF7" ? "text-zinc-900" : "text-white"} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold truncate leading-tight">{std.name}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                          {std.hex}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= KEY BULLET HIGHLIGHTS (PDP DETAILS ACCORDION) ================= */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-zinc-100">
              <div>
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  Key Feature Bullet Points (PDP Details Accordion)
                </label>
                <span className="text-[11px] text-zinc-500">
                  Directly renders in the expandable DETAILS accordion on the storefront
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {details.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                    <span className="font-medium text-zinc-800">• {d}</span>
                    <button
                      type="button"
                      onClick={() => setDetails(details.filter((_, i) => i !== idx))}
                      className="text-zinc-400 hover:text-red-600 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDetailInput}
                  onChange={(e) => setNewDetailInput(e.target.value)}
                  onKeyDown={handleAddDetail}
                  placeholder="Type feature bullet point and press Enter (e.g. 100% Combed Loopback Cotton)..."
                  className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDetailInput.trim()) {
                      setDetails([...details, newDetailInput.trim()]);
                      setNewDetailInput("");
                    }
                  }}
                  className="h-8 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Pricing & Profit Margin Calculator (Horizontal Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3499"
                    className="w-full border border-zinc-300 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Compare at</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="4499"
                    className="w-full border border-zinc-300 rounded-xl pl-7 pr-3 py-2 text-xs text-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Profit Margin Calculator</label>
                <div className="h-9 rounded-xl bg-zinc-100 border border-zinc-200 px-3 flex items-center text-xs font-bold text-zinc-800">
                  <span>{profitMarginPct}% Margin / ₹{profitAmt.toLocaleString()} Profit</span>
                </div>
              </div>
            </div>

            {/* Size Variant Inventory Matrix Table */}
            <div className="flex flex-col gap-2 pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Size Variant Inventory Matrix
              </label>

              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold text-[11px]">
                    <tr>
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5">SKU</th>
                      <th className="px-4 py-2.5">Inventory</th>
                      <th className="px-4 py-2.5">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {variants.map((v, idx) => (
                      <tr key={v.size} className="hover:bg-zinc-50/50">
                        <td className="px-4 py-2 font-bold text-zinc-900">{v.size}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, sku: val } : item))
                              );
                            }}
                            className="w-full border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-mono font-medium text-zinc-700 focus:outline-none focus:border-zinc-400"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={v.inventory}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, inventory: val } : item))
                              );
                            }}
                            className="w-24 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-400"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, price: val } : item))
                              );
                            }}
                            className="w-28 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-400"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Technical Specifications & Wash Care */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Fabric GSM</label>
                <input
                  type="text"
                  value={fabricGsm}
                  onChange={(e) => setFabricGsm(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Fit Profile</label>
                <input
                  type="text"
                  value={fitProfile}
                  onChange={(e) => setFitProfile(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Apparel HSN</label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  className="w-full border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-800"
                />
              </div>
            </div>

            <div className="text-xs pt-1">
              <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Wash Care Instructions (PDP Accordion)</label>
              <input
                type="text"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg px-3 py-1.5 text-xs text-zinc-800"
              />
            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDEBAR (34%) ================= */}
        <div className="flex flex-col gap-5">

          {/* 1. Publish Status Card */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">Publish Status</h3>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {isOnline ? "Online" : "Draft"}
              </span>

              <button
                type="button"
                onClick={() => setIsOnline(!isOnline)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isOnline ? "bg-zinc-900" : "bg-zinc-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isOnline ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <span className="text-[11px] text-zinc-500">Visible on Online Store & Live Drop Radar</span>
          </div>

          {/* 2. Category Card */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider font-mono">Category</h3>
              <span className="text-[10px] font-mono text-zinc-400">Storefront Taxonomy</span>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-zinc-900 focus:outline-none focus:border-zinc-500 cursor-pointer"
            >
              {getAllCategoriesSync().map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name} {c.isFeatured ? "★ (Featured on Home)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Drop Collection Tags Card */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider">Drop Collection Tags</h3>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 text-blue-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-blue-200/60 flex items-center gap-1"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((tag) => tag !== t))}
                    className="hover:text-blue-950 cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag and press Enter..."
              className="w-full border border-zinc-300 rounded-xl px-3 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400"
            />
          </div>

          {/* 4. Live Mobile Storefront Preview Mockup */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <h3 className="font-bold text-xs text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone size={14} className="text-zinc-500" /> Live Mobile Storefront Preview
            </h3>

            {/* Smartphone Frame Mockup */}
            <div className="border-4 border-zinc-800 rounded-[28px] p-3 bg-white shadow-xl flex flex-col gap-2.5 max-w-65 mx-auto w-full">
              {/* Phone Speaker Notch */}
              <div className="w-16 h-2.5 bg-zinc-800 rounded-full mx-auto" />

              {/* Mockup Store Header */}
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-900 border-b border-zinc-100 pb-1">
                <span>FLIQ</span>
                <span className="font-mono text-zinc-400">BAG (0)</span>
              </div>

              {/* Product Hero Image inside Phone */}
              <div className="w-full aspect-4/5 bg-zinc-100 rounded-xl overflow-hidden relative shadow-xs flex items-center justify-center">
                {primaryHeroUrl ? (
                  <Image src={primaryHeroUrl} alt="Mobile preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-300 gap-1 text-[10px]">
                    <Camera size={18} />
                    <span>Upload photo</span>
                  </div>
                )}
              </div>

              {/* Product Title & Pricing */}
              <div>
                <h4 className="font-bold text-xs text-zinc-900 leading-tight truncate">
                  {title || "Garment Title"}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-xs text-zinc-900">₹{priceNum ? priceNum.toLocaleString() : "0"}</span>
                  {compareAtPrice && parseFloat(compareAtPrice) > priceNum && (
                    <span className="text-[10px] text-zinc-400 line-through">₹{parseFloat(compareAtPrice).toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Live Color Swatches in Mobile Mockup */}
              {colors.length > 0 && (
                <div className="flex items-center gap-1.5 py-0.5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Colors:</span>
                  <div className="flex items-center gap-1">
                    {colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Buttons in Phone */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Size</span>
                <div className="flex gap-1">
                  {["S", "M", "L", "XL"].map((sz) => (
                    <div
                      key={sz}
                      className="flex-1 py-1 rounded-md bg-zinc-100 text-center font-bold text-[9px] text-zinc-800 border border-zinc-200"
                    >
                      {sz}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="w-full py-2 bg-zinc-900 text-white font-bold text-[10px] rounded-lg text-center shadow-xs">
                Add to Bag
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ================= LIGHTBOX ZOOM IMAGE PREVIEW MODAL ================= */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden max-w-lg w-full p-4 flex flex-col gap-3 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center text-white pb-2 border-b border-zinc-800">
              <div>
                <span className="text-xs font-bold block">High-Resolution Garment Preview</span>
                <span className="text-[10px] text-zinc-400 font-mono">Recommended: 1200 × 1500 px (4:5 Aspect Ratio)</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="w-full aspect-4/5 bg-zinc-900 rounded-xl overflow-hidden relative border border-zinc-800 flex items-center justify-center">
              <Image src={previewImageUrl} alt="High resolution preview" fill className="object-contain" />
            </div>

            <div className="flex justify-between items-center text-zinc-400 text-[11px] pt-1">
              <span>Ready for high-resolution storefront zoom</span>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="px-3 py-1 bg-white text-zinc-900 text-xs font-bold rounded-lg cursor-pointer hover:bg-zinc-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
