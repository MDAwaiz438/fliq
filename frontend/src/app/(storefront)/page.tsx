
import Hero from "@/components/sections/Hero";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import LatestDrops from "@/components/sections/LatestDrops";
import AboutSection from "@/components/sections/AboutSection";

export default function Home() {
  return (
    <div className="bg-(--bg) text-(--text-primary) font-sans selection:bg-(--accent) selection:text-(--bg) overflow-x-hidden">
      <Hero />
      <FeaturedCategories />
      <LatestDrops />
      
      {/* Lookbook / Editorial Section */}
      <section className="w-full border-b border-(--border) flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-(--bg-surface) border-b md:border-b-0 md:border-r border-(--border) relative noise-overlay">
          <h2 className="font-(family-name:--font-display) text-4xl lg:text-6xl font-bold uppercase tracking-tighter mb-6 text-(--text-primary) relative z-10">
            FW/26 <span className="text-(--accent)">Campaign</span>
          </h2>
          <p className="text-base font-medium uppercase tracking-wide text-(--text-muted) mb-8 max-w-md relative z-10">
            Shot on location in brutalist concrete structures. Highlighting the intersection of street culture and modern isolation.
          </p>
          <a href="/products" className="inline-block w-max text-sm font-bold uppercase tracking-widest text-(--accent) border-b border-(--accent) pb-1 hover:opacity-70 transition-opacity relative z-10">
            View Lookbook
          </a>
        </div>
        <div className="w-full md:w-1/2 min-h-[50vh] relative">
          <img src="/urban_architecture_1785655002952.png" alt="Campaign" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-l from-transparent to-(--bg) opacity-20" />
        </div>
      </section>

      <AboutSection />

      {/* Newsletter Section */}
      <section className="w-full border-b border-(--border) bg-(--bg-surface) p-8 md:p-16 lg:p-24 flex flex-col items-center text-center relative noise-overlay">
        <h2 className="font-(family-name:--font-display) text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-(--text-primary) relative z-10">
          Join The <span className="text-(--accent)">Blueprint</span>
        </h2>
        <p className="text-sm font-bold uppercase tracking-widest text-(--text-muted) mb-8 relative z-10">Exclusive access to drops and editorial content.</p>
        <form className="flex w-full max-w-md border border-(--border) relative z-10 focus-within:border-(--accent) transition-colors" action="#">
          <input 
            type="email" 
            placeholder="ENTER YOUR EMAIL" 
            className="flex-1 bg-transparent p-4 text-sm font-bold uppercase tracking-widest focus:outline-none text-(--text-primary) placeholder:text-(--text-muted)"
          />
          <button type="submit" className="bg-(--accent) text-(--bg) px-6 font-bold uppercase tracking-widest hover:bg-(--accent-hover) transition-colors">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}