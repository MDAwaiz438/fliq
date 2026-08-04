export default function AboutSection() {
  return (
    <section className="flex flex-col lg:flex-row w-full border-b border-(--border)">
      <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-(--border) bg-(--bg-surface) py-16 relative noise-overlay">
        <h2 className="font-(family-name:--font-display) text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter mb-6 md:mb-8 text-(--text-primary) relative z-10">
          The<br/><span className="text-(--accent)">Blueprint</span>
        </h2>
        <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed uppercase tracking-wide text-(--text-muted) relative z-10">
          Born from the streets, built for the culture. We create garments that refuse to blend in. No excess. Just raw form and function with an edge that cuts.
        </p>
      </div>
      <div className="w-full lg:w-1/2 h-[40vh] md:h-[50vh] lg:h-auto relative">
        <img 
          src="/urban_architecture_1785655002952.png" 
          alt="Urban Architecture" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-(--bg-surface) via-transparent to-transparent opacity-40" />
      </div>
    </section>
  );
}
