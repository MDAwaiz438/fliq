"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingBag, User, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { searchProducts } from "@/app/actions/products";
export default function Navbar() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery).then(results => {
        setSearchResults(results);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen, isSearchOpen]);


  return (
    <>
      <nav className="w-full px-4 md:px-6 py-4 flex items-center justify-between border-b border-(--border) bg-(--bg) sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <span className="font-(family-name:--font-display) font-bold text-3xl md:text-4xl tracking-tighter leading-none text-(--accent) transition-all duration-200" style={{ transitionTimingFunction: 'var(--ease-out)' }}>FLIQ</span>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] leading-none text-(--text-muted)">Street Culture</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 font-(family-name:--font-display) font-semibold text-sm uppercase tracking-widest">
          <Link href="/products" className="text-(--text-primary) hover:text-(--accent) transition-colors duration-200">Shop</Link>
          <Link href="/products" className="text-(--text-primary) hover:text-(--accent) transition-colors duration-200">Collections</Link>
          <Link href="/about" className="text-(--text-primary) hover:text-(--accent) transition-colors duration-200">About</Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Search Bar */}
          <div 
            className="hidden md:flex items-center border-b border-(--border) pb-1 cursor-pointer hover:border-(--accent) transition-colors duration-200 group/search" 
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={16} className="mr-2 text-(--text-muted) group-hover/search:text-(--accent) transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-(--text-muted) min-w-30">Search...</span>
          </div>
          
          {/* Mobile Search Icon */}
          <button className="md:hidden text-(--text-primary) hover:text-(--accent) transition-colors" onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </button>

          <Link href="/account" className="text-(--text-primary) hover:text-(--accent) transition-colors"><User size={20} className="md:w-5.5 md:h-5.5" /></Link>
          <Link href="/cart" className="hover:text-(--accent) transition-colors relative block text-(--text-primary)">
            <ShoppingBag size={20} className="md:w-5.5 md:h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 h-4 w-4 bg-(--accent) text-(--bg) rounded-full text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="lg:hidden text-(--text-primary) hover:text-(--accent) transition-colors" onClick={() => setIsMenuOpen(true)}>
            <Menu size={20} className="md:w-5.5 md:h-5.5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-(--bg) z-50 flex flex-col">
          <div className="px-4 py-4 flex items-center justify-between border-b border-(--border)">
            <div className="flex flex-col">
              <span className="font-(family-name:--font-display) font-bold text-3xl tracking-tighter leading-none text-(--accent)">FLIQ</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] leading-none text-(--text-muted)">Street Culture</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-(--text-primary) hover:text-(--accent) transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center px-8 space-y-8">
            <Link href="/products" className="font-(family-name:--font-display) text-5xl font-bold uppercase tracking-tighter text-(--text-primary) hover:text-(--accent) transition-colors duration-200" style={{ animationDelay: '0ms' }}>Shop</Link>
            <Link href="/products" className="font-(family-name:--font-display) text-5xl font-bold uppercase tracking-tighter text-(--text-primary) hover:text-(--accent) transition-colors duration-200" style={{ animationDelay: '50ms' }}>Collections</Link>
            <Link href="/about" className="font-(family-name:--font-display) text-5xl font-bold uppercase tracking-tighter text-(--text-primary) hover:text-(--accent) transition-colors duration-200" style={{ animationDelay: '100ms' }}>About</Link>
            <div className="pt-8 border-t border-(--border) space-y-4">
              <Link href="/account" className="block text-xl font-bold uppercase tracking-widest text-(--text-muted) hover:text-(--accent)">Account</Link>
              <Link href="/faq" className="block text-xl font-bold uppercase tracking-widest text-(--text-muted) hover:text-(--accent)">Support</Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-(--bg) z-50 flex flex-col">
          <div className="px-4 md:px-8 py-6 border-b border-(--border) flex items-center gap-4">
            <Search size={24} className="text-(--accent)" />
            <input 
              type="text" 
              placeholder="SEARCH PRODUCTS..."
              className="flex-1 text-2xl md:text-4xl font-(family-name:--font-display) font-bold uppercase tracking-tighter focus:outline-none bg-transparent text-(--text-primary) placeholder:text-(--text-muted)"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setIsSearchOpen(false)} className="p-2 text-(--text-primary) hover:text-(--accent) transition-colors border border-(--border) hover:border-(--accent)">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-(--bg-surface) p-4 md:p-8">
            {searchQuery ? (
              searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {searchResults.map((p) => (
                    <Link href={`/products/${p.id}`} key={p.id} className="group border border-(--border) bg-(--bg-card) p-4 flex flex-col hover:border-(--accent) transition-colors duration-200">
                      <div className="aspect-square bg-(--bg-surface) border border-(--border) mb-4 overflow-hidden">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ transitionTimingFunction: 'var(--ease-out)' }} />
                      </div>
                      <h3 className="font-(family-name:--font-display) font-bold uppercase tracking-tighter text-lg text-(--text-primary) line-clamp-1">{p.name}</h3>
                      <p className="font-bold text-sm text-(--accent)">₹{p.price}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-2xl font-(family-name:--font-display) font-bold uppercase tracking-tighter text-(--text-muted)">No results found for &quot;{searchQuery}&quot;</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold uppercase tracking-widest text-(--text-muted)">
                <div>
                  <h4 className="mb-4 text-(--accent) border-b border-(--accent) pb-2 inline-block">Trending Searches</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => setSearchQuery('Hoodie')} className="hover:text-(--accent) flex items-center gap-2 transition-colors"><ArrowRight size={14}/> Hoodie</button></li>
                    <li><button onClick={() => setSearchQuery('Cargo')} className="hover:text-(--accent) flex items-center gap-2 transition-colors"><ArrowRight size={14}/> Cargo Pants</button></li>
                    <li><button onClick={() => setSearchQuery('Vibram')} className="hover:text-(--accent) flex items-center gap-2 transition-colors"><ArrowRight size={14}/> Vibram Sneakers</button></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
