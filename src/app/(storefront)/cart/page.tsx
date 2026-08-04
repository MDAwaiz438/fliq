import { CartClient } from "@/components/ui/CartClient";

export const metadata = {
  title: 'Cart | Fliq',
  description: 'Review your items and proceed to secure checkout.',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-(--accent) text-(--bg)">
      <div className="px-6 md:px-12 pt-12 pb-8 border-b-2 border-(--bg)">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
          Your Cart
        </h1>
      </div>

      <CartClient />
    </div>
  );
}
