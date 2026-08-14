"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  CheckCircle,
  Package,
  Layers,
  Camera,
  Trash2,
  Palette,
  Check,
} from "lucide-react";
import Image from "next/image";
import { saveProductToStorage, getAllCategoriesSync, saveCategoryToStorage } from "@/lib/products";
import { BACKEND_URL } from "@/lib/api";

interface AddProductModalProps {
  onClose: () => void;
  onProductCreated: (newProduct: any) => void;
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
  { name: "Sky Blue", hex: "#38BDF8", category: "Blues & Cool" },
  
  // Earth & Greens
  { name: "Olive Army Green", hex: "#3F4F38", category: "Earth & Greens" },
  { name: "Forest Green", hex: "#14532D", category: "Earth & Greens" },
  { name: "Sand Khaki", hex: "#D4C5B9", category: "Earth & Greens" },
  { name: "Mocha Brown", hex: "#5C4033", category: "Earth & Greens" },
  
  // Warm & Accents
  { name: "Vintage Maroon", hex: "#881337", category: "Warm & Accents" },
  { name: "Crimson Red", hex: "#DC2626", category: "Warm & Accents" },
  { name: "Terracotta Rust", hex: "#C2410C", category: "Warm & Accents" },
];

export default function AddProductModal({ onClose, onProductCreated }: AddProductModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const [title, setTitle] = useState("");
  const [categoriesList, setCategoriesList] = useState<any[]>(() => getAllCategoriesSync());
  const [category, setCategory] = useState("HOODIES");
  const [isCategoryFeatured, setIsCategoryFeatured] = useState(true);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [price, setPrice] = useState("3499");
  const [compareAtPrice, setCompareAtPrice] = useState("4499");
  const [description, setDescription] = useState("Heavyweight 450GSM custom loopback 100% cotton with raw-edge seams.");
  const [fabricGsm, setFabricGsm] = useState("450 GSM Heavyweight Loopback");
  const [fitProfile, setFitProfile] = useState("Boxy Oversized / Drop Shoulder");
  const [hsnCode, setHsnCode] = useState("6109.10.00");

  // Drag & Drop Image Gallery (Max 5 Images)
  const MAX_IMAGES = 5;
  const [imageUrls, setImageUrls] = useState<string[]>([
    "/images/product_distortion.png"
  ]);

  const [isDraggingZone, setIsDraggingZone] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Standard Industry Colors (Default is Onyx Black)
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: "Onyx Black", hex: "#09090B" }
  ]);

  // Stock levels per size
  const [stockS, setStockS] = useState("15");
  const [stockM, setStockM] = useState("30");
  const [stockL, setStockL] = useState("25");
  const [stockXL, setStockXL] = useState("10");

  const [loading, setLoading] = useState(false);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [activePreviewImageIndex, setActivePreviewImageIndex] = useState(0);

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
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
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
    if (activePreviewImageIndex >= imageUrls.length - 1) {
      setActivePreviewImageIndex(Math.max(0, imageUrls.length - 2));
    }
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = imageUrls[index];
    const remaining = imageUrls.filter((_, i) => i !== index);
    setImageUrls([item, ...remaining]);
  };

  const toggleStandardColor = (stdColor: { name: string; hex: string }) => {
    const exists = colors.some((c) => c.name === stdColor.name);
    if (exists) {
      if (colors.length === 1) {
        alert("A product must have at least 1 color.");
        return;
      }
      setColors(colors.filter((c) => c.name !== stdColor.name));
    } else {
      setColors([...colors, { name: stdColor.name, hex: stdColor.hex }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a product title!");

    const uploadedUrls = imageUrls.filter(Boolean);

    if (uploadedUrls.length === 0) {
      return alert("Please upload or provide at least 1 garment photo!");
    }

    setLoading(true);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProductPayload = {
      id: `prod_${Date.now()}`,
      title: title.trim(),
      slug,
      description,
      price: parseFloat(price) || 2999,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      category,
      images: uploadedUrls,
      colors,
      inventoryQuantity:
        (parseInt(stockS) || 0) +
        (parseInt(stockM) || 0) +
        (parseInt(stockL) || 0) +
        (parseInt(stockXL) || 0),
      sku: `FLQ-${category.substring(0, 4)}-${Date.now().toString().slice(-4)}`,
      syncStatus: "SYNCED",
      lastSyncedAt: "Just now",
      image: uploadedUrls[0] || "/images/product_distortion.png",
      fabricGsm,
      fitProfile,
      hsnCode
    };

    try {
      // Ensure category is registered in the Category & Featured Category Hub
      saveCategoryToStorage({
        id: `cat_${category.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
        name: category.toUpperCase(),
        slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        subtitle: "ATELIER COLLECTION",
        image: uploadedUrls[0] || "/images/shirt_viscose.png",
        isFeatured: isCategoryFeatured
      });

      saveProductToStorage(newProductPayload as any);
      await fetch(`${BACKEND_URL}/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProductPayload.title,
          slug: newProductPayload.slug,
          description: newProductPayload.description,
          price: newProductPayload.price,
          compareAtPrice: newProductPayload.compareAtPrice,
          category: newProductPayload.category,
          images: newProductPayload.images,
          colors: newProductPayload.colors,
          variants: [
            { sku: `${newProductPayload.sku}-S`, title: "Size S", color: colors[0]?.name || "Black", size: "S", price: newProductPayload.price, inventoryQuantity: parseInt(stockS) || 0 },
            { sku: `${newProductPayload.sku}-M`, title: "Size M", color: colors[0]?.name || "Black", size: "M", price: newProductPayload.price, inventoryQuantity: parseInt(stockM) || 0 },
            { sku: `${newProductPayload.sku}-L`, title: "Size L", color: colors[0]?.name || "Black", size: "L", price: newProductPayload.price, inventoryQuantity: parseInt(stockL) || 0 },
            { sku: `${newProductPayload.sku}-XL`, title: "Size XL", color: colors[0]?.name || "Black", size: "XL", price: newProductPayload.price, inventoryQuantity: parseInt(stockXL) || 0 },
          ]
        })
      });
    } catch (err) {
      console.warn("Backend API offline, saved to local dashboard state:", err);
    }

    setLoading(false);
    onProductCreated(newProductPayload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <div className="bg-white border border-zinc-200 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Modal Header */}
        <div className="bg-zinc-900 px-5 py-3.5 flex justify-between items-center text-white border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-[#2271b1]" />
            <div>
              <h2 className="text-sm font-bold text-white">Create New Garment Drop</h2>
              <span className="text-[10px] text-zinc-400 font-mono">Drag & Drop Image Studio (1200×1500px • Max 5)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

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

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="p-5 overflow-y-auto flex flex-col gap-4 text-xs max-h-[80vh]"
        >

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="font-semibold text-zinc-700">Garment Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distortion Oversized Heavy Hoodie"
                required
                className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-zinc-700">Category *</label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="text-[10px] font-mono text-acid hover:underline"
                >
                  {isCustomCategory ? "Choose Existing" : "+ New Category"}
                </button>
              </div>

              {isCustomCategory ? (
                <div className="flex flex-col gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. BOMBER JACKETS"
                    value={customCategoryName}
                    onChange={(e) => {
                      setCustomCategoryName(e.target.value);
                      setCategory(e.target.value.toUpperCase());
                    }}
                    className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#2271b1] uppercase font-mono"
                  />
                  <label className="flex items-center gap-1.5 text-[10px] text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCategoryFeatured}
                      onChange={(e) => setIsCategoryFeatured(e.target.checked)}
                      className="accent-zinc-900 w-3.5 h-3.5"
                    />
                    Feature this category on Homepage &amp; Shop
                  </label>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    const matched = categoriesList.find((c) => c.name === e.target.value);
                    if (matched) {
                      setIsCategoryFeatured(matched.isFeatured);
                    }
                  }}
                  className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#2271b1] bg-white font-mono"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {cat.name} {cat.isFeatured ? "★ (Featured)" : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Pricing & GST HSN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-700">Retail Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3499"
                required
                className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#2271b1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-700">Compare-at Price (₹)</label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="4499"
                className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-500 focus:outline-none focus:border-[#2271b1]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-zinc-700">Apparel HSN Code</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                placeholder="6109.10.00"
                className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-700 focus:outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>

          {/* ================= DRAG & DROP MEDIA UPLOADER (MAX 5 IMAGES) ================= */}
          <div className="border border-zinc-200 rounded-lg p-3.5 bg-zinc-50/70 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                  <Camera size={14} className="text-[#2271b1]" /> Product Imagery & Gallery
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-zinc-500">Drag & drop garment photos or browse</span>
                  <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    1200 × 1500 px (4:5 Ratio)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    imageUrls.length >= MAX_IMAGES
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-white text-zinc-700 border-zinc-200"
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

            {/* Drag and Drop Zone */}
            {imageUrls.length < MAX_IMAGES ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingZone(true);
                }}
                onDragLeave={() => setIsDraggingZone(false)}
                onDrop={handleDropFiles}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer transition-all ${
                  isDraggingZone
                    ? "border-[#2271b1] bg-blue-50 ring-2 ring-[#2271b1]/20"
                    : "border-zinc-300 bg-white hover:border-zinc-400"
                }`}
              >
                <Upload size={18} className={isDraggingZone ? "text-[#2271b1] animate-bounce" : "text-zinc-500"} />
                <div>
                  <span className="text-xs font-bold text-zinc-800 block">
                    {isDraggingZone ? "Drop Images Here" : "Drag & drop photos here, or click to browse"}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Recommended: <strong>1200 × 1500 px</strong> (4:5 Portrait) • Supports PNG, JPG, WebP • {MAX_IMAGES - imageUrls.length} slot{MAX_IMAGES - imageUrls.length > 1 ? "s" : ""} left
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-zinc-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                  <span className="font-bold">Maximum {MAX_IMAGES} images uploaded.</span>
                </div>
                <span className="text-[10px] text-zinc-500">Delete an image to upload another.</span>
              </div>
            )}

            {/* Direct URL Input */}
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
                  placeholder="Or paste direct image URL (e.g. /images/product_distortion.png)..."
                  className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="h-7 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded cursor-pointer shrink-0"
                >
                  Add URL
                </button>
              </div>
            )}

            {/* Uploaded Gallery Grid */}
            {imageUrls.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
                    Uploaded Gallery ({imageUrls.length}/{MAX_IMAGES})
                  </span>
                  <span className="text-[10px] text-zinc-400">Click photo to zoom preview</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {imageUrls.map((url, idx) => {
                    const isPrimary = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-1.5 flex flex-col gap-1 transition-all relative ${
                          isPrimary ? "border-zinc-900 bg-zinc-50 shadow-xs" : "border-zinc-200 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-zinc-700">
                            {isPrimary ? "Cover" : `Photo ${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(idx)}
                            className="text-zinc-400 hover:text-red-600 cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>

                        <div
                          onClick={() => setPreviewImageUrl(url)}
                          className="w-full aspect-4/5 bg-zinc-100 rounded overflow-hidden relative border border-zinc-200 group cursor-pointer"
                          title="Click to zoom preview"
                        >
                          <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" />
                          {isPrimary && (
                            <div className="absolute top-1 left-1 bg-zinc-900/90 text-white text-[7px] font-extrabold px-1 rounded uppercase tracking-wider">
                              COVER
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                            <span className="text-[9px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">
                              Zoom Preview
                            </span>
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetPrimary(idx);
                                }}
                                className="px-1.5 py-0.5 bg-white text-zinc-900 text-[9px] font-bold rounded shadow-xs cursor-pointer hover:bg-zinc-100"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(idx);
                              }}
                              className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded shadow-xs cursor-pointer flex items-center gap-0.5"
                            >
                              <Trash2 size={9} /> Delete
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

          {/* ================= STANDARD INDUSTRY COLORS ================= */}
          <div className="border border-zinc-200 rounded-lg p-3.5 bg-zinc-50/70 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <div>
                <label className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                  <Palette size={14} className="text-[#2271b1]" /> Standard Industry Colors
                </label>
                <span className="text-[11px] text-zinc-500">Click standard apparel color swatches to toggle on / off</span>
              </div>
              <span className="text-[10px] text-zinc-600 font-bold bg-white border border-zinc-200 px-2 py-0.5 rounded">
                {colors.length} selected
              </span>
            </div>

            {/* Color Swatch Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {STANDARD_INDUSTRY_COLORS.map((std) => {
                const isSelected = colors.some((c) => c.name === std.name);
                return (
                  <button
                    key={std.name}
                    type="button"
                    onClick={() => toggleStandardColor(std)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                        : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-300 block shadow-2xs"
                        style={{ backgroundColor: std.hex }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <Check size={10} className={std.hex === "#FFFFFF" || std.hex === "#FDFBF7" ? "text-zinc-900" : "text-white"} />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold truncate leading-tight">{std.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Variants & Stock Quantities */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-zinc-700 flex items-center gap-1">
              <Layers size={13} className="text-[#2271b1]" /> Live Inventory Levels by Size Variant
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { size: "S", val: stockS, set: setStockS },
                { size: "M", val: stockM, set: setStockM },
                { size: "L", val: stockL, set: setStockL },
                { size: "XL", val: stockXL, set: setStockXL },
              ].map((st, i) => (
                <div key={i} className="bg-zinc-50 border border-zinc-200 p-2 rounded text-center">
                  <span className="text-[10px] text-zinc-600 font-bold block">SIZE {st.size}</span>
                  <input
                    type="number"
                    value={st.val}
                    onChange={(e) => st.set(e.target.value)}
                    className="w-full bg-white border border-zinc-300 px-1 py-0.5 text-center font-bold text-xs rounded mt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-between items-center gap-2 pt-3 border-t border-zinc-100 shrink-0">
            <button
              type="button"
              onClick={() => setShowLivePreview(true)}
              className="h-8 px-3.5 rounded border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Camera size={13} className="text-[#2271b1]" />
              <span>Preview Customer View</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-3 rounded border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-medium cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="h-8 px-4 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                {loading ? "Publishing Garment..." : "Publish to MongoDB Live"}
              </button>
            </div>
          </div>

        </form>

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
                <span className="text-[10px] text-zinc-400 font-mono">Recommended 1200 × 1500 px (4:5 Aspect Ratio)</span>
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

      {/* ================= LIVE CUSTOMER STOREFRONT PREVIEW MODAL ================= */}
      {showLivePreview && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowLivePreview(false)}
        >
          <div
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden max-w-xl w-full flex flex-col max-h-[90vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Storefront Mock Header */}
            <div className="bg-zinc-900 px-5 py-3 flex justify-between items-center text-white border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-widest text-xs">FLIQ</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">| Storefront PDP Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLivePreview(false)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Storefront Mock Body */}
            <div className="p-5 overflow-y-auto flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {/* Main Storefront Product Image */}
                <div className="flex flex-col gap-2">
                  <div className="w-full aspect-4/5 bg-zinc-100 rounded-xl overflow-hidden relative border border-zinc-200 shadow-xs">
                    <Image
                      src={imageUrls[activePreviewImageIndex] || imageUrls[0] || "/images/product_distortion.png"}
                      alt="Garment Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Thumbnail Swapper */}
                  {imageUrls.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto py-1">
                      {imageUrls.map((u, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActivePreviewImageIndex(i)}
                          className={`w-12 aspect-4/5 rounded-md overflow-hidden relative border-2 shrink-0 cursor-pointer transition-all ${
                            activePreviewImageIndex === i ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image src={u} alt={`Thumb ${i + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PDP Right Info Side */}
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{category}</span>
                    <h3 className="font-bold text-sm text-zinc-900 mt-0.5 leading-tight">{title || "Garment Title"}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-zinc-900">₹{parseFloat(price || "0").toLocaleString()}</span>
                      {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price || "0") && (
                        <span className="text-xs text-zinc-400 line-through">₹{parseFloat(compareAtPrice).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Colors Preview */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-100">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Color: {colors[0]?.name || "Standard"}
                    </span>
                    <div className="flex gap-1.5">
                      {colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full border border-zinc-300 shadow-xs block"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Preview */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-100">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Select Size</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["S", "M", "L", "XL"].map((sz) => (
                        <div key={sz} className="py-1.5 text-center font-bold text-xs bg-zinc-100 rounded-lg border border-zinc-200">
                          {sz}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Story & Specifications */}
                  <div className="flex flex-col gap-1 pt-2 border-t border-zinc-100 text-[11px] text-zinc-600">
                    <p className="line-clamp-3">{description}</p>
                    <span className="font-mono text-[10px] text-zinc-400 mt-1">• {fabricGsm}</span>
                    <span className="font-mono text-[10px] text-zinc-400">• {fitProfile}</span>
                  </div>

                  {/* Add To Bag Mockup */}
                  <div className="w-full py-2.5 bg-zinc-900 text-white font-bold text-xs rounded-xl text-center shadow-xs mt-1">
                    Add to Bag — ₹{parseFloat(price || "0").toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLivePreview(false)}
                className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Back to Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
