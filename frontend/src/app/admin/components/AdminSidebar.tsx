"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Scan,
  Users,
  Truck,
  Webhook,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Layers
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavGroup {
  label: string;
  items: Array<{
    id: string;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }>;
}

const navigationGroups: NavGroup[] = [
  {
    label: "CORE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "reports", label: "Analytics & Reports", icon: BarChart3 },
    ]
  },
  {
    label: "CATALOG",
    items: [
      { id: "products", label: "Products", icon: Package, badge: "4" },
      { id: "categories", label: "Featured Categories", icon: Layers },
      { id: "barcodes", label: "Barcode & Scanner", icon: Scan },
    ]
  },
  {
    label: "OPERATIONS",
    items: [
      { id: "orders", label: "Orders", icon: ShoppingCart, badge: "4", badgeColor: "bg-blue-500" },
      { id: "customers", label: "Customers", icon: Users },
      { id: "shipping", label: "Logistics & AWB", icon: Truck },
      { id: "webhooks", label: "Webhook Radar", icon: Webhook },
    ]
  },
  {
    label: "SYSTEM",
    items: [
      { id: "settings", label: "Store Settings", icon: Settings },
    ]
  }
];

export default function AdminSidebar({
  activeSection,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-zinc-200/90 flex flex-col z-50 transition-all duration-200 shadow-[1px_0_10px_rgba(0,0,0,0.02)] ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-100 shrink-0">
        {!collapsed ? (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
              FL
            </div>
            <span className="text-sm font-bold text-zinc-900 tracking-tight">FLIQ ATELIER</span>
            <span className="text-[9px] bg-zinc-100 text-zinc-600 font-mono font-semibold px-1.5 py-0.5 rounded">
              OS
            </span>
          </Link>
        ) : (
          <Link href="/admin" className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
              F
            </div>
          </Link>
        )}

        <button
          onClick={onToggleCollapse}
          className="text-zinc-400 hover:text-zinc-900 p-1 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-4 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            {!collapsed && (
              <span className="text-[10px] font-bold text-zinc-400 px-2.5 py-1 tracking-wider uppercase">
                {group.label}
              </span>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer group relative ${
                    isActive
                      ? "bg-zinc-900 text-white font-semibold shadow-xs"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 ${
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-700"
                    }`}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeColor
                              ? `${item.badgeColor} text-white`
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom MongoDB Status Pill & Storefront Link */}
      <div className="p-3 border-t border-zinc-100 flex flex-col gap-2 bg-zinc-50/50">
        {!collapsed && (
          <div className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-between text-[11px] shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-zinc-800">MongoDB Atlas</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9px] font-bold">
              LIVE
            </span>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors border border-transparent hover:border-zinc-200 ${
            collapsed ? "justify-center" : ""
          }`}
          title="Visit Live Storefront"
        >
          <Store size={15} className="text-zinc-500" />
          {!collapsed && <span>Storefront ↗</span>}
        </Link>
      </div>
    </aside>
  );
}
