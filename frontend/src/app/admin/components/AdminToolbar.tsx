"use client";

import { useState } from "react";
import { Bell, Search, RefreshCw, Plus, Command } from "lucide-react";

interface AdminToolbarProps {
  pageTitle: string;
  pageDescription?: string;
  onRefresh?: () => void;
  onNewProduct?: () => void;
}

export default function AdminToolbar({
  onRefresh,
  onNewProduct,
}: AdminToolbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <header
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 h-14 px-6 flex items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Search & Global Command Box */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search orders, drops, customers, AWBs..."
            className="w-full bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200/90 rounded-lg pl-9 pr-12 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all font-medium"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px] font-mono text-zinc-400">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3 shrink-0">

        {/* MongoDB Live Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>MongoDB: CONNECTED | LIVE</span>
        </div>

        {/* Refresh Ticker */}
        <button
          onClick={handleRefreshClick}
          title="Refresh Data"
          className={`h-8 w-8 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-xs ${
            refreshing ? "animate-spin text-zinc-900" : ""
          }`}
        >
          <RefreshCw size={13} />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="System notifications"
            className="h-8 w-8 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all relative cursor-pointer shadow-xs"
          >
            <Bell size={14} />
            <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 mb-2">
                <span className="text-xs font-bold text-zinc-900">Live Activity Feed</span>
                <span className="text-[10px] font-mono text-zinc-400">Real-time</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                  <span className="font-bold text-blue-900 block">Shiprocket AWB Assigned</span>
                  <p className="text-[11px] text-blue-700 mt-0.5">BlueDart Express assigned for Order #FLQ-9042</p>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <span className="font-bold text-emerald-900 block">Inventory Live Sync</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Cluster fliq.6fqxaqp.mongodb.net updated</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick New Drop Action */}
        {onNewProduct && (
          <button
            onClick={onNewProduct}
            className="h-8 px-3.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={13} />
            <span>New Drop</span>
          </button>
        )}

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-zinc-100 cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
