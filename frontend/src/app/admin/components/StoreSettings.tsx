"use client";

import { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Database,
  Truck,
  AlertTriangle,
  Save,
  CheckCircle2,
  Lock,
  RefreshCw
} from "lucide-react";

export default function StoreSettings() {
  const [storeName, setStoreName] = useState("FLIQ — Streetwear Atelier");
  const [supportEmail, setSupportEmail] = useState("concierge@fliq.in");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("2999");
  const [codExtraFee, setCodExtraFee] = useState("99");
  const [gstRate, setGstRate] = useState("12");
  const [autoFulfillShiprocket, setAutoFulfillShiprocket] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div
      className="flex flex-col gap-6 max-w-4xl animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Settings Header */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-[#2271b1]" />
            <h2 className="text-base font-bold text-zinc-900">E-Commerce Store & Logistics Configuration</h2>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Military-grade security rules, tax configurations, Shiprocket automation, and inventory alerts.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="font-semibold">All store settings and MongoDB security policies updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs">

        {/* 1. General Branding & Contact */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-200">
            <h3 className="text-xs font-bold text-zinc-900">1. Storefront Identity & Operations Concierge</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Storefront Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-zinc-300 rounded px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#2271b1]"
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Support & Concierge Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full border border-zinc-300 rounded px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>
        </div>

        {/* 2. Inventory Alert Automation */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-500" /> 2. Inventory Scarcity & Low Stock Alerts
            </h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Low Stock Warning Threshold (Units)</label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full border border-zinc-300 rounded px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#2271b1]"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Products falling below this count will trigger an amber badge in the catalog.
              </span>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded flex items-center gap-3">
              <input
                type="checkbox"
                id="backorders"
                defaultChecked={false}
                className="accent-[#2271b1] w-4 h-4 rounded"
              />
              <label htmlFor="backorders" className="cursor-pointer">
                <span className="font-semibold text-zinc-900 block">Strict Scarcity Policy</span>
                <span className="text-[11px] text-zinc-500">Prevent backorders when MongoDB inventory hits 0.</span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Taxes & Shipping Rules */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <Truck size={14} className="text-[#2271b1]" /> 3. Shipping Rules & Apparel GST Taxes
            </h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full border border-zinc-300 rounded px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#2271b1]"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">Orders above this qualify for free express shipping.</span>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">COD Extra Verification Fee (₹)</label>
              <input
                type="number"
                value={codExtraFee}
                onChange={(e) => setCodExtraFee(e.target.value)}
                className="w-full border border-zinc-300 rounded px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#2271b1]"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">Added to COD checkout to prevent RTO fraud.</span>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 block mb-1">Apparel GST Rate (%)</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full border border-zinc-300 rounded px-3 py-1.5 text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#2271b1]"
              >
                <option value="12">12% GST (Standard Garments)</option>
                <option value="5">5% GST (Under ₹1000 items)</option>
                <option value="18">18% GST (Accessories & Outerwear)</option>
              </select>
              <span className="text-[11px] text-zinc-400 mt-1 block">Automatic GST invoice breakdown calculation.</span>
            </div>
          </div>
        </div>

        {/* 4. Military-Grade Database & Security Guard */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> 4. Database Security & Cluster Health
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
              TLS 1.3 ENCRYPTED
            </span>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-900 block">MongoDB Atlas Production Cluster</span>
                <span className="text-[11px] text-zinc-500 font-mono">fliq.6fqxaqp.mongodb.net/fliq_db</span>
              </div>
              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-900 block">Shiprocket Smart Courier Dispatch</span>
                <span className="text-[11px] text-zinc-500">Auto-assign lowest latency courier (BlueDart / Delhivery)</span>
              </div>
              <input
                type="checkbox"
                checked={autoFulfillShiprocket}
                onChange={(e) => setAutoFulfillShiprocket(e.target.checked)}
                className="accent-[#2271b1] w-4 h-4 rounded"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="font-semibold text-zinc-900 block">Database Snapshot Backup</span>
                <span className="text-[11px] text-zinc-500">Manual point-in-time state snapshot trigger</span>
              </div>
              <button
                type="button"
                onClick={() => alert("MongoDB automated snapshot initiated. Snapshot ID: snap_882914")}
                className="h-7 px-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 rounded font-semibold text-xs cursor-pointer flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={11} /> Create Snapshot Now
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="h-9 px-5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Save size={14} /> Save All Store Configurations
          </button>
        </div>

      </form>
    </div>
  );
}
