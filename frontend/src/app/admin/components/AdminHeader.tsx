"use client";

import { useState } from "react";
import { Bell, Search, RefreshCw, ShieldAlert, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onRefresh: () => void;
  unresolvedCount: number;
}

export default function AdminHeader({ onRefresh, unresolvedCount }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">

        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-base font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            FLIQ
            <span className="text-[10px] bg-zinc-100 text-zinc-500 font-mono font-medium px-1.5 py-0.5 rounded">Admin</span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-zinc-200 text-[10px] font-mono font-medium">
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              MongoDB
            </span>
            <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Shiprocket
            </span>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block w-52 md:w-64">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search orders, AWBs, SKUs…"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md pl-8 pr-3 py-1.5 text-[11px] outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder:text-zinc-400"
            />
          </div>

          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors text-zinc-500 hover:text-zinc-700 cursor-pointer ${refreshing ? "animate-spin text-blue-600" : ""}`}
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors relative cursor-pointer"
            >
              <Bell size={14} className="text-zinc-500" />
              {unresolvedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {unresolvedCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 p-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100 mb-2">
                  <h4 className="text-[11px] font-semibold text-zinc-900 flex items-center gap-1">
                    <ShieldAlert size={12} className="text-amber-500" /> Alerts
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400">{unresolvedCount} open</span>
                </div>

                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  <div className="p-2 bg-amber-50 border border-amber-100 rounded-md text-[11px]">
                    <div className="flex justify-between text-amber-800">
                      <span className="font-medium">Database Sync Notice</span>
                      <span className="text-[10px] text-amber-500 font-mono">2m</span>
                    </div>
                    <p className="text-[10px] text-amber-700 mt-0.5">Order #FLQ-9023 queued for verification.</p>
                  </div>

                  <div className="p-2 bg-blue-50 border border-blue-100 rounded-md text-[11px]">
                    <div className="flex justify-between text-blue-800">
                      <span className="font-medium">AWB Generated</span>
                      <span className="text-[10px] text-blue-500 font-mono">12m</span>
                    </div>
                    <p className="text-[10px] text-blue-700 mt-0.5">Delhivery assigned for #FLQ-9018.</p>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-zinc-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1.5 rounded-md transition-colors"
          >
            Storefront <ArrowUpRight size={12} />
          </Link>
        </div>

      </div>
    </header>
  );
}
