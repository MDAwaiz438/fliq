"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturedCategories() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="w-full border-b border-(--border) flex flex-col lg:flex-row"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        viewport={{ once: true }}
        className="w-full lg:w-1/2 group cursor-pointer border-b lg:border-b-0 lg:border-r border-(--border) relative overflow-hidden h-[40vh] md:h-[50vh] lg:h-[70vh]"
      >
        <Link href="/products" className="block w-full h-full">
          <img 
            src="/collection_apparel_1785654983275.png" 
            alt="Apparel" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          />
          <div className="absolute inset-0 bg-(--bg)/50 group-hover:bg-(--bg)/30 transition-colors duration-500 flex flex-col items-center justify-center">
            <h2 className="font-(family-name:--font-display) text-4xl md:text-5xl lg:text-6xl font-bold text-(--accent) uppercase tracking-tighter mb-4">Apparel</h2>
            <span className="bg-(--accent) text-(--bg) px-6 py-2 uppercase font-bold text-xs tracking-widest group-hover:glow transition-all duration-200">Shop Now</span>
          </div>
        </Link>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        viewport={{ once: true }}
        className="w-full lg:w-1/2 group cursor-pointer relative overflow-hidden h-[40vh] md:h-[50vh] lg:h-[70vh]"
      >
        <Link href="/products" className="block w-full h-full">
          <img 
            src="/collection_footwear_1785654993042.png" 
            alt="Footwear" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          />
          <div className="absolute inset-0 bg-(--bg)/50 group-hover:bg-(--bg)/30 transition-colors duration-500 flex flex-col items-center justify-center">
            <h2 className="font-(family-name:--font-display) text-4xl md:text-5xl lg:text-6xl font-bold text-(--accent) uppercase tracking-tighter mb-4">Footwear</h2>
            <span className="bg-(--accent) text-(--bg) px-6 py-2 uppercase font-bold text-xs tracking-widest group-hover:glow transition-all duration-200">Shop Now</span>
          </div>
        </Link>
      </motion.div>
    </motion.section>
  );
}
