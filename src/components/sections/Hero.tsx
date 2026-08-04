"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="relative w-full min-h-[90vh] flex flex-col lg:flex-row border-b border-(--border)">
      <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-(--border) bg-(--bg) z-10 py-16 lg:py-0 relative noise-overlay">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-(--accent) mb-4 md:mb-6"
        >
          FW / 26 Collection
        </motion.p>
        <motion.h1 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="font-(family-name:--font-display) text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.85] mb-4 md:mb-6 text-(--text-primary)"
        >
          Raw<br/><span className="text-(--accent) glow-text">Form</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="text-base md:text-lg lg:text-xl font-medium max-w-md mb-6 md:mb-8 uppercase tracking-wide text-(--text-muted)"
        >
          Streetwear essentials for the culture. Bold drops, raw edges, maximum attitude.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link href="/products">
            <button className="bg-(--accent) text-(--bg) px-8 md:px-10 py-4 md:py-5 uppercase font-bold tracking-widest text-xs md:text-sm hover:bg-transparent hover:text-(--accent) border border-(--accent) transition-all duration-200 flex items-center gap-3 w-fit glow" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
              Explore Collection <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
      <div className="w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-auto relative bg-(--bg-surface)">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          src="/hero_streetwear_1785654973505.png" 
          alt="Hero Streetwear Model" 
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-(--bg) via-transparent to-transparent opacity-60" />
      </div>
    </header>
  );
}
