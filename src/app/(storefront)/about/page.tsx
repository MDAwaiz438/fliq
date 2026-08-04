import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="px-6 md:px-12 py-8 border-b border-(--border)">
        <h1 className="font-(family-name:--font-display) text-5xl md:text-7xl font-bold uppercase tracking-tighter text-(--text-primary)">
          About <span className="text-(--accent)">Fliq</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-(--border) relative noise-overlay">
          <h2 className="font-(family-name:--font-display) text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-8 text-(--text-primary) relative z-10">
            The <span className="text-(--accent)">Blueprint</span>
          </h2>
          <div className="space-y-6 text-base md:text-lg font-medium uppercase tracking-wide leading-relaxed text-(--text-muted) relative z-10">
            <p>
              Founded in 2026, Fliq was born from the streets — a rejection of cookie-cutter fashion and a return to raw, unfiltered self-expression.
            </p>
            <p>
              We draw from brutalist architecture, underground skate culture, and the energy of late-night city blocks. Every piece is designed to be a statement, not a compromise.
            </p>
            <p>
              Heavyweight fabrics, structured silhouettes, and a palette that doesn&apos;t apologize. This is streetwear for the culture, by the culture.
            </p>
          </div>
          
          <div className="mt-12 relative z-10">
            <Link href="/products">
              <Button size="lg">Explore Collection</Button>
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto min-h-[60vh] relative">
          <img 
            src="/urban_architecture_1785655002952.png" 
            alt="Urban Architecture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-(--bg) via-transparent to-transparent opacity-30" />
        </div>
      </div>
    </div>
  );
}
