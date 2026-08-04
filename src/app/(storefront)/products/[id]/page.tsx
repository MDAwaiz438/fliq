import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/app/actions/products";
import { Product } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { ProductDetailClient } from "@/components/ui/ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dbProduct = await getProductById(resolvedParams.id);

  if (!dbProduct) {
    notFound();
  }

  const product: Product = {
    ...dbProduct,
    images: JSON.parse(dbProduct.images)
  };

  const allDbProducts = await getProducts();
  const allProducts: Product[] = allDbProducts.map(p => ({
    ...p,
    images: JSON.parse(p.images)
  }));
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-(--bg)">
      <ProductDetailClient product={product} />

      {/* Related Products */}
      <section className="w-full border-t border-(--border)">
        <div className="p-6 md:p-8 lg:p-12 border-b border-(--border) flex items-end justify-between">
          <h2 className="font-(family-name:--font-display) text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter text-(--text-primary)">
            Complete the <span className="text-(--accent)">look</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-(--border) border-b border-(--border)">
          {relatedProducts.map((p, index) => (
            <ProductCard key={p.id} product={p} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
