import Link from "next/link";
import { LayoutDashboard, Package, Settings, LogOut, Upload } from "lucide-react";

export const metadata = {
  title: 'Admin Panel | Fliq',
  description: 'Manage store inventory, orders, and settings.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-(--bg) flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-(--bg) text-(--text-primary) flex flex-col border-r border-(--border)">
        <div className="p-6 border-b border-(--accent)">
          <Link href="/admin" className="text-2xl font-black uppercase tracking-tighter">
            Fliq Admin
          </Link>
          <div className="mt-1 text-xs font-bold uppercase tracking-widest text-(--text-muted)">
            System Online
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-(--bg) rounded-md transition-colors">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <div className="pt-4 pb-2 px-4 text-xs font-black uppercase tracking-widest text-(--text-muted)">
            Inventory
          </div>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-(--bg) rounded-md transition-colors">
            <Package size={18} />
            Products
          </Link>
          <Link href="/admin/inventory/upload" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-(--bg) rounded-md transition-colors text-(--bg)">
            <Upload size={18} />
            Bulk Upload
          </Link>
          <div className="pt-4 pb-2 px-4 text-xs font-black uppercase tracking-widest text-(--text-muted)">
            System
          </div>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-(--bg) rounded-md transition-colors">
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-(--accent)">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-(--text-primary) hover:bg-(--accent) hover:text-(--bg) rounded-md transition-colors">
            <LogOut size={18} />
            Exit to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
