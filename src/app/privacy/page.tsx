export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-(--accent) text-(--bg)">
      <div className="px-6 md:px-12 py-8 border-b-2 border-(--bg)">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Privacy Policy
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-8 md:p-16 space-y-8 font-medium text-(--bg)">
        <p className="text-sm uppercase font-bold tracking-widest text-(--bg)">Last Updated: August 2026</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or subscribe to our newsletter. This may include your name, email, shipping address, and payment details.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">2. How We Use Your Information</h2>
          <p>We use the information to process your orders, communicate with you, improve our services, and send promotional materials if you have opted in.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">3. Information Sharing</h2>
          <p>We do not sell your personal information. We may share information with trusted third-party service providers (like Stripe for payments or shipping carriers) solely for the purpose of fulfilling your order.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">4. Cookies</h2>
          <p>We use cookies to enhance your browsing experience, remember your cart items, and analyze site traffic.</p>
        </section>
      </div>
    </div>
  );
}
