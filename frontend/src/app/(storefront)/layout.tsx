import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <Toaster 
        toastOptions={{
          className: 'border border-(--border) rounded-none font-bold uppercase tracking-widest text-xs',
          style: { background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--accent)' }
        }} 
      />
    </CartProvider>
  );
}