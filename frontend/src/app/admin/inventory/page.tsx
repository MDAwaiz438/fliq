import { DUMMY_PRODUCTS } from "@/lib/data";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import InventoryTableRow from "@/components/admin/InventoryTableRow";

export default async function AdminInventoryPage() {
  const variants = DUMMY_PRODUCTS.flatMap(product => 
    product.variants.map(variant => ({
      ...variant,
      product
    }))
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
            Inventory
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-(--bg)">
            Manage {variants.length} SKU items
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/inventory/upload">
            <Button className="border-2 border-(--bg) bg-(--bg) text-(--bg) hover:bg-(--bg)">
              Bulk Upload
            </Button>
          </Link>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> New Product
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-(--accent) text-(--bg) border-2 border-(--bg) p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-96 flex items-center">
          <Search size={18} className="absolute left-4 text-(--bg)" />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="w-full pl-12 pr-4 py-3 border-2 border-(--bg) text-sm font-bold uppercase tracking-widest focus:outline-none"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select className="flex-1 md:flex-none border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest bg-transparent focus:outline-none">
            <option>All Categories</option>
            <option>Apparel</option>
            <option>Footwear</option>
          </select>
          <select className="flex-1 md:flex-none border-2 border-(--bg) p-3 text-sm font-bold uppercase tracking-widest bg-transparent focus:outline-none">
            <option>Sort: SKU (A-Z)</option>
            <option>Sort: Stock (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-(--accent) text-(--bg) border-2 border-(--bg) flex-1 overflow-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-(--bg) sticky top-0 z-10">
            <tr className="text-xs font-black uppercase tracking-widest text-(--bg) border-b-2 border-(--bg)">
              <th className="p-4 w-12">
                <input type="checkbox" className="w-4 h-4 accent-black" />
              </th>
              <th className="p-4">Product</th>
              <th className="p-4">Size</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <InventoryTableRow key={variant.id} variant={variant} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
