import { Button } from "@/components/ui/Button";

export const metadata = {
  title: 'Contact | Fliq',
  description: 'Get in touch with the Fliq team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-(--accent) text-(--bg)">
      <div className="px-6 md:px-12 py-8 border-b-2 border-(--bg)">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Contact Us
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 border-b-2 lg:border-b-0 lg:border-r-2 border-(--bg) bg-(--bg)">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Send a message</h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-(--accent) text-(--bg)" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-(--accent) text-(--bg)" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs font-black uppercase tracking-widest">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="w-full border-2 border-(--bg) p-3 text-sm font-medium focus:outline-none focus:ring-0 focus:border-(--bg) bg-(--accent) text-(--bg) resize-none" 
              ></textarea>
            </div>
            <Button type="button" size="lg" className="w-full">Submit</Button>
          </form>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="space-y-12">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Customer Service</h3>
              <p className="text-base font-medium uppercase tracking-wide text-(--bg)">support@fliq.com</p>
              <p className="text-base font-medium uppercase tracking-wide text-(--bg) mt-2">Mon - Fri, 9am - 5pm EST</p>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Press & Wholesale</h3>
              <p className="text-base font-medium uppercase tracking-wide text-(--bg)">info@fliq.com</p>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Headquarters</h3>
              <p className="text-base font-medium uppercase tracking-wide text-(--bg) leading-relaxed">
                100 Brutalist Ave.<br/>
                Concrete District, NY 10001<br/>
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
