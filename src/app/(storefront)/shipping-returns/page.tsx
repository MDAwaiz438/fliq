export const metadata = {
  title: 'Shipping & Returns | Fliq',
  description: 'Information regarding shipping logistics and return policies.',
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-(--accent) text-(--bg)">
      <div className="px-6 md:px-12 py-8 border-b-2 border-(--bg)">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Shipping & Returns
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-8 md:p-16 space-y-16 text-(--bg)">
        
        <section>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 pb-4 border-b-2 border-(--bg)">Shipping Logistics</h2>
          <div className="space-y-6 font-medium text-sm md:text-base leading-relaxed">
            <p>Orders are processed and shipped within 1-2 business days from our New York facility. You will receive a tracking link via email once your order has been dispatched.</p>
            <div className="border-2 border-(--bg) bg-(--bg) p-6">
              <ul className="space-y-4">
                <li className="flex justify-between border-b-2 border-(--accent) pb-2">
                  <span className="font-bold uppercase tracking-widest text-xs">Standard Domestic</span>
                  <span>3-5 Business Days (₹10)</span>
                </li>
                <li className="flex justify-between border-b-2 border-(--accent) pb-2">
                  <span className="font-bold uppercase tracking-widest text-xs">Express Domestic</span>
                  <span>1-2 Business Days (₹25)</span>
                </li>
                <li className="flex justify-between pt-2">
                  <span className="font-bold uppercase tracking-widest text-xs">International</span>
                  <span>7-14 Business Days (Calculated at checkout)</span>
                </li>
              </ul>
            </div>
            <p className="text-xs uppercase font-bold tracking-widest text-(--bg) pt-4">Free standard domestic shipping on all orders over ₹200.</p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 pb-4 border-b-2 border-(--bg)">Return Policy</h2>
          <div className="space-y-6 font-medium text-sm md:text-base leading-relaxed">
            <p>We accept returns for refund or exchange within 14 days of delivery. Items must be returned in their original, unworn condition with all tags attached.</p>
            <p>To initiate a return, please contact support@fliq.com with your order number. A return shipping label will be provided. Note that a ₹10 restocking fee is deducted from all refunds. Exchanges are exempt from the restocking fee.</p>
            <p>Final sale items, including heavily discounted archive pieces and certain accessories, are strictly non-returnable.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
