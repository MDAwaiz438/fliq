import { Button } from "@/components/ui/Button";

export const metadata = {
  title: 'Account | Fliq',
  description: 'Manage your Fliq account, orders, and addresses.',
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-(--accent) text-(--bg)">
      <div className="px-6 md:px-12 py-8 border-b-2 border-(--bg) flex justify-between items-end">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            My Account
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-(--bg) mt-2">Welcome back, John</p>
        </div>
        <Button variant="outline" size="sm" className="hidden md:inline-flex">Sign Out</Button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 border-b-2 lg:border-b-0 lg:border-r-2 border-(--bg) p-6 md:p-12">
          <ul className="space-y-6 text-sm font-black uppercase tracking-widest">
            <li><a href="#" className="hover:underline underline-offset-4 decoration-2">Order History</a></li>
            <li><a href="#" className="text-(--bg) hover:text-(--bg) hover:underline underline-offset-4 decoration-2 transition-colors">Addresses</a></li>
            <li><a href="#" className="text-(--bg) hover:text-(--bg) hover:underline underline-offset-4 decoration-2 transition-colors">Account Details</a></li>
            <li className="pt-6 border-t-2 border-(--bg) md:hidden">
              <a href="#" className="text-(--bg) hover:underline underline-offset-4 decoration-2 transition-colors">Sign Out</a>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="w-full lg:w-3/4 p-6 md:p-12 bg-(--bg) text-(--accent) min-h-[60vh]">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Order History</h2>
          
          <div className="border-2 border-(--accent) bg-(--bg) overflow-hidden">
            <div className="grid grid-cols-4 border-b-2 border-(--accent) bg-(--accent) text-(--bg) p-4 text-xs font-black uppercase tracking-widest">
              <div>Order</div>
              <div>Date</div>
              <div>Status</div>
              <div className="text-right">Total</div>
            </div>
            
            {/* Mock Order 1 */}
            <div className="grid grid-cols-4 p-4 text-sm font-medium border-b-2 border-(--accent) items-center">
              <div className="font-bold underline underline-offset-4">#FLQ-1092</div>
              <div>Aug 01, 2026</div>
              <div><span className="inline-block bg-(--accent) text-(--bg) px-2 py-1 text-[10px] font-bold uppercase">Processing</span></div>
              <div className="text-right font-black">₹300.00</div>
            </div>

            {/* Mock Order 2 */}
            <div className="grid grid-cols-4 p-4 text-sm font-medium items-center">
              <div className="font-bold underline underline-offset-4">#FLQ-1045</div>
              <div>Jul 15, 2026</div>
              <div><span className="inline-block bg-(--accent) text-(--bg) px-2 py-1 text-[10px] font-bold uppercase">Delivered</span></div>
              <div className="text-right font-black">₹120.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
