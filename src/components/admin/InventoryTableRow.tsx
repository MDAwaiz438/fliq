"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/app/actions/inventory";

interface InventoryTableRowProps {
  variant: any; // Prisma ProductVariant with product
}

export default function InventoryTableRow({ variant }: InventoryTableRowProps) {
  const [stock, setStock] = useState(variant.stock);
  const [isPending, startTransition] = useTransition();

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setStock(val);
  };

  const handleStockBlur = () => {
    if (stock !== variant.stock) {
      startTransition(async () => {
        await updateStock(variant.id, stock);
      });
    }
  };

  const isLowStock = stock <= variant.lowStock;

  return (
    <tr className="border-b border-(--accent) hover:bg-(--bg) transition-colors group">
      <td className="p-4">
        <input type="checkbox" className="w-4 h-4 accent-black" />
      </td>
      <td className="p-4 flex flex-col">
        <div className="font-black uppercase">{variant.product.name}</div>
        <div className="text-[10px] font-bold uppercase text-(--text-muted) mt-1">
          {variant.product.color}
        </div>
      </td>
      <td className="p-4 font-bold uppercase tracking-widest text-xs text-(--text-primary)">
        {variant.size}
      </td>
      <td className="p-4 font-bold uppercase tracking-widest text-xs text-(--text-primary)">
        {variant.sku}
      </td>
      <td className="p-4">
        <input
          type="number"
          value={stock}
          onChange={handleStockChange}
          onBlur={handleStockBlur}
          className="w-20 p-2 border-2 border-(--bg) bg-transparent font-black text-sm focus:outline-none focus:border-(--accent)"
          disabled={isPending}
        />
      </td>
      <td className="p-4">
        <span className={`inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest ${isLowStock ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {isLowStock ? 'Low Stock' : 'In Stock'}
        </span>
      </td>
    </tr>
  );
}
