export default function TermsPage() {
  return (
    <div className="min-h-screen bg-(--accent) text-(--bg)">
      <div className="px-6 md:px-12 py-8 border-b-2 border-(--bg)">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Terms of Service
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-8 md:p-16 space-y-8 font-medium text-(--bg)">
        <p className="text-sm uppercase font-bold tracking-widest text-(--bg)">Last Updated: August 2026</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">1. Acceptance of Terms</h2>
          <p>By accessing or using the Fliq website, you agree to be bound by these Terms of Service. If you do not agree, do not use the site.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">2. Intellectual Property</h2>
          <p>All content, including but not limited to text, graphics, logos, images, and software, is the property of Fliq and is protected by copyright laws.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">3. Products and Pricing</h2>
          <p>We reserve the right to modify prices, discontinue products, or change descriptions at any time without notice. All prices are listed in USD.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">4. Return Policy</h2>
          <p>Returns are accepted within 14 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached.</p>
        </section>
      </div>
    </div>
  );
}
