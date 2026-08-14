"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  category?: string;
  onOpenFullscreen?: () => void;
}

export default function ProductImageZoom({
  src,
  alt,
  category,
  onOpenFullscreen
}: ProductImageZoomProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setMousePos({ x, y, percentX, percentY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenFullscreen?.()}
      className="relative aspect-3/4 w-full rounded-md overflow-hidden border border-zinc-200 shadow-xs cursor-zoom-in group select-none bg-white flex items-center justify-center"
    >
      {/* Full-Bleed Edge-to-Edge Main Image */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover object-center w-full h-full transition-opacity duration-200"
      />

      {/* Amazon / Flipkart Style Magnifying Glass Lens Overlay */}
      {isHovering && (
        <div
          className="absolute z-20 pointer-events-none border-2 border-acid/80 shadow-2xl rounded-sm bg-white overflow-hidden hidden md:block"
          style={{
            width: "180px",
            height: "180px",
            left: `${mousePos.x - 90}px`,
            top: `${mousePos.y - 90}px`,
          }}
        >
          {/* Zoomed Lens Content */}
          <div
            className="absolute w-full h-full bg-no-repeat"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "280% 280%",
              backgroundPosition: `${mousePos.percentX}% ${mousePos.percentY}%`,
            }}
          />
        </div>
      )}

      {/* Fullscreen Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenFullscreen?.();
        }}
        className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 hover:text-black hover:bg-white shadow-xs cursor-pointer transition-all"
        title="Open Fullscreen View"
      >
        <Maximize2 size={15} />
      </button>
    </div>
  );
}
