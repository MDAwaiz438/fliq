export const metadata = {
  title: 'FAQ | Fliq',
  description: 'Frequently asked questions about Fliq products and services.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the fit of your garments?",
      a: "Our garments feature a signature oversized, boxy fit. We recommend taking your normal size for the intended brutalist silhouette, or sizing down if you prefer a more traditional fit."
    },
    {
      q: "When will out-of-stock items be restocked?",
      a: "Due to our production methods, we rarely restock previous collections. However, core uniform pieces are restocked quarterly. Join our newsletter to be notified."
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, we ship globally. International shipping rates and times vary depending on the destination and will be calculated at checkout."
    },
    {
      q: "How should I care for my Fliq pieces?",
      a: "For longevity, we recommend washing all garments inside out on a cold, gentle cycle and hang drying. Do not tumble dry heavyweight fleece."
    }
  ];

  return (
    <div className="min-h-screen bg-(--accent) text-(--bg)">
      <div className="px-6 md:px-12 py-8 border-b-2 border-(--bg)">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          FAQ
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16">
        <div className="border-t-2 border-(--bg)">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b-2 border-(--bg) py-8">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4">{faq.q}</h3>
              <p className="text-sm md:text-base font-medium uppercase tracking-wide text-(--bg) leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
