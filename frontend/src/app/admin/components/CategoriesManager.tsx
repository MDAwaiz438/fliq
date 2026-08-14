"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Star,
  Check,
  X,
  Layers,
  Tag
} from "lucide-react";
import {
  CategoryItem,
  getAllCategoriesSync,
  saveCategoryToStorage,
  toggleCategoryFeatured,
  deleteCategoryFromStorage,
  getAllProductsSync
} from "@/lib/products";

export default function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryItem[]>(() => getAllCategoriesSync());
  const [products, setProducts] = useState(() => getAllProductsSync());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("/images/shirt_viscose.png");
  const [isFeatured, setIsFeatured] = useState(true);
  const [highlightTag, setHighlightTag] = useState("HOT DROP");

  const refreshData = () => {
    setCategories(getAllCategoriesSync());
    setProducts(getAllProductsSync());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener("fliq_categories_updated", handleUpdate);
    window.addEventListener("fliq_products_updated", handleUpdate);
    return () => {
      window.removeEventListener("fliq_categories_updated", handleUpdate);
      window.removeEventListener("fliq_products_updated", handleUpdate);
    };
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setSubtitle("100% VISCOSE & LINEN");
    setImage("/images/shirt_viscose.png");
    setIsFeatured(true);
    setHighlightTag("HOT DROP");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSubtitle(cat.subtitle || "");
    setImage(cat.image || "/images/shirt_viscose.png");
    setIsFeatured(cat.isFeatured);
    setHighlightTag(cat.highlightTag || "");
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryData: CategoryItem = {
      id: editingCategory ? editingCategory.id : `cat_${Date.now()}`,
      name: name.trim().toUpperCase(),
      slug: editingCategory ? editingCategory.slug : slug,
      subtitle: subtitle.trim().toUpperCase() || "ATELIER COLLECTION",
      image: image.trim() || "/images/shirt_viscose.png",
      isFeatured,
      highlightTag: highlightTag.trim().toUpperCase() || undefined,
      sortOrder: editingCategory?.sortOrder || categories.length + 1
    };

    saveCategoryToStorage(categoryData);
    setIsModalOpen(false);
    refreshData();
  };

  const handleToggleFeatured = (id: string) => {
    toggleCategoryFeatured(id);
    refreshData();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      deleteCategoryFromStorage(id);
      refreshData();
    }
  };

  // Helper to count products
  const getProductCount = (catName: string) => {
    const cleanCat = catName.toUpperCase();
    return products.filter((p) => {
      if (!p.category) return false;
      const c = p.category.toUpperCase();
      return c === cleanCat || c.includes(cleanCat) || cleanCat.includes(c);
    }).length;
  };

  const featuredCount = categories.filter((c) => c.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-xl border border-zinc-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
              STOREFRONT TAXONOMY
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {featuredCount} FEATURED ON HOME &amp; SHOP
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Category &amp; Featured Category Hub
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Manage category taxonomy, highlight tags, editorial covers, and homepage banner placements.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} />
          Create New Category
        </button>
      </div>

      {/* Featured Categories Spotlight Bar */}
      <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-acid" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
              Live Homepage &amp; Shop Featured Bar ({featuredCount} Categories Active)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Changes sync instantly to Storefront
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleToggleFeatured(cat.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                cat.isFeatured
                  ? "bg-zinc-900/90 border-blue-500/80 shadow-md ring-1 ring-blue-500/50"
                  : "bg-zinc-900/30 border-zinc-800 opacity-40 hover:opacity-80"
              }`}
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/40 border border-white/5">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                {cat.highlightTag && (
                  <span className="absolute top-1 left-1 text-[8px] font-mono font-bold bg-black/80 backdrop-blur-xs text-white px-1.5 py-0.5 rounded">
                    {cat.highlightTag}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-tight block text-white line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 block">
                  {getProductCount(cat.name)} Items
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] font-mono">
                <span className={cat.isFeatured ? "text-acid font-bold" : "text-zinc-500"}>
                  {cat.isFeatured ? "★ FEATURED" : "HIDDEN"}
                </span>
                <span className="text-zinc-400 hover:text-white">Toggle</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Categories Management Table */}
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-zinc-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
              All Configured Categories ({categories.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Click star icon to feature/unfeature
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Preview Cover</th>
                <th className="py-3 px-4">Category Name &amp; Slug</th>
                <th className="py-3 px-4">Subtitle / Sub-Headline</th>
                <th className="py-3 px-4">Highlight Tag</th>
                <th className="py-3 px-4">Live Products</th>
                <th className="py-3 px-4 text-center">Featured Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.map((cat) => {
                const count = getProductCount(cat.name);
                return (
                  <tr key={cat.id} className="hover:bg-zinc-50/50 transition-colors">
                    {/* Cover Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 shadow-2xs">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                    </td>

                    {/* Category Name & Slug */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-900 text-xs uppercase">{cat.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400">/shop/{cat.slug}</div>
                    </td>

                    {/* Subtitle */}
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-600">
                      {cat.subtitle || "—"}
                    </td>

                    {/* Highlight Tag */}
                    <td className="py-3 px-4">
                      {cat.highlightTag ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                          <Tag size={10} className="text-acid" />
                          {cat.highlightTag}
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-mono text-[10px]">None</span>
                      )}
                    </td>

                    {/* Product count */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-mono text-[10px] font-bold">
                        {count} {count === 1 ? "Product" : "Products"}
                      </span>
                    </td>

                    {/* Featured Toggle Switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(cat.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          cat.isFeatured
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 shadow-2xs"
                            : "bg-zinc-100 text-zinc-400 border border-zinc-200 hover:bg-zinc-200"
                        }`}
                        title="Toggle Featured Status"
                      >
                        <Star
                          size={11}
                          className={cat.isFeatured ? "fill-amber-500 text-amber-500" : "text-zinc-400"}
                        />
                        {cat.isFeatured ? "Featured" : "Standard"}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                          title="Edit Category Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CREATE / EDIT CATEGORY MODAL ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-zinc-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-acid uppercase">
                  CATEGORY CONFIGURATION
                </span>
                <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Product Category"}
                </h2>
              </div>

              {/* Name */}
              <div>
                <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1 uppercase">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CASUAL SHIRTS, BOMBER JACKETS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs font-mono uppercase text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1 uppercase">
                  Subtitle / Material Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% VISCOSE &amp; LINEN"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs font-mono uppercase text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              {/* Image Selection */}
              <div>
                <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1.5 uppercase">
                  Category Cover Image Path / URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="/images/shirt_viscose.png"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 mb-2"
                />

                <div className="flex gap-2">
                  {[
                    { label: "Viscose", path: "/images/shirt_viscose.png" },
                    { label: "Distortion", path: "/images/product_distortion.png" },
                    { label: "Chinos", path: "/images/chinos_cream.png" },
                    { label: "Polo Knit", path: "/images/polo_knit.png" },
                    { label: "Hero Graphic", path: "/images/hero.png" },
                    { label: "Editorial", path: "/images/editorial.png" }
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.path}
                      onClick={() => setImage(preset.path)}
                      className={`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                        image === preset.path
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlight Tag */}
              <div>
                <label className="text-[11px] font-mono font-bold text-zinc-700 block mb-1 uppercase">
                  Highlight Badge / Tag (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HOT DROP, SUMMER 26, ATELIER EXCLUSIVE"
                  value={highlightTag}
                  onChange={(e) => setHighlightTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs font-mono uppercase text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              {/* Featured Switch */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-900 font-mono uppercase">
                    Feature on Homepage &amp; Shop Grid
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Displays high-impact editorial card in Featured Collections
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 accent-zinc-900 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check size={15} />
                {editingCategory ? "Save Category Changes" : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
