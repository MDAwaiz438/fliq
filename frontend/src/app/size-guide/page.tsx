"use client";

import { useState } from "react";
import { Ruler, CheckCircle2 } from "lucide-react";

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<"INCHES" | "CM">("INCHES");
  const [activeTab, setActiveTab] = useState<"HOODIES" | "TEES" | "SHIRTS" | "PANTS">("HOODIES");

  const measurements = {
    HOODIES: [
      { size: "S", chest: unit === "INCHES" ? "42" : "106", length: unit === "INCHES" ? "27" : "68.5", shoulder: unit === "INCHES" ? "21" : "53.5", sleeve: unit === "INCHES" ? "24" : "61" },
      { size: "M", chest: unit === "INCHES" ? "44" : "112", length: unit === "INCHES" ? "28" : "71", shoulder: unit === "INCHES" ? "22" : "56", sleeve: unit === "INCHES" ? "25" : "63.5" },
      { size: "L", chest: unit === "INCHES" ? "46" : "117", length: unit === "INCHES" ? "29" : "73.5", shoulder: unit === "INCHES" ? "23" : "58.5", sleeve: unit === "INCHES" ? "26" : "66" },
      { size: "XL", chest: unit === "INCHES" ? "48" : "122", length: unit === "INCHES" ? "30" : "76", shoulder: unit === "INCHES" ? "24" : "61", sleeve: unit === "INCHES" ? "27" : "68.5" },
    ],
    TEES: [
      { size: "S", chest: unit === "INCHES" ? "40" : "101.5", length: unit === "INCHES" ? "28" : "71", shoulder: unit === "INCHES" ? "19.5" : "49.5", sleeve: unit === "INCHES" ? "8.5" : "21.5" },
      { size: "M", chest: unit === "INCHES" ? "42" : "106.5", length: unit === "INCHES" ? "29" : "73.5", shoulder: unit === "INCHES" ? "20.5" : "52", sleeve: unit === "INCHES" ? "9" : "23" },
      { size: "L", chest: unit === "INCHES" ? "44" : "112", length: unit === "INCHES" ? "30" : "76", shoulder: unit === "INCHES" ? "21.5" : "54.5", sleeve: unit === "INCHES" ? "9.5" : "24" },
      { size: "XL", chest: unit === "INCHES" ? "46" : "117", length: unit === "INCHES" ? "31" : "78.5", shoulder: unit === "INCHES" ? "22.5" : "57", sleeve: unit === "INCHES" ? "10" : "25.5" },
    ],
    SHIRTS: [
      { size: "S", chest: unit === "INCHES" ? "41" : "104", length: unit === "INCHES" ? "27.5" : "70", shoulder: unit === "INCHES" ? "19" : "48", sleeve: unit === "INCHES" ? "23.5" : "60" },
      { size: "M", chest: unit === "INCHES" ? "43" : "109", length: unit === "INCHES" ? "28.5" : "72.5", shoulder: unit === "INCHES" ? "20" : "51", sleeve: unit === "INCHES" ? "24.5" : "62" },
      { size: "L", chest: unit === "INCHES" ? "45" : "114", length: unit === "INCHES" ? "29.5" : "75", shoulder: unit === "INCHES" ? "21" : "53", sleeve: unit === "INCHES" ? "25.5" : "65" },
      { size: "XL", chest: unit === "INCHES" ? "47" : "119", length: unit === "INCHES" ? "30.5" : "77.5", shoulder: unit === "INCHES" ? "22" : "56", sleeve: unit === "INCHES" ? "26.5" : "67" },
    ],
    PANTS: [
      { size: "30", chest: unit === "INCHES" ? "30" : "76", length: unit === "INCHES" ? "40" : "101.5", shoulder: unit === "INCHES" ? "24" : "61", sleeve: unit === "INCHES" ? "7.5" : "19" },
      { size: "32", chest: unit === "INCHES" ? "32" : "81", length: unit === "INCHES" ? "41" : "104", shoulder: unit === "INCHES" ? "25" : "63.5", sleeve: unit === "INCHES" ? "8" : "20.5" },
      { size: "34", chest: unit === "INCHES" ? "34" : "86", length: unit === "INCHES" ? "42" : "106.5", shoulder: unit === "INCHES" ? "26" : "66", sleeve: unit === "INCHES" ? "8.5" : "21.5" },
      { size: "36", chest: unit === "INCHES" ? "36" : "91.5", length: unit === "INCHES" ? "43" : "109", shoulder: unit === "INCHES" ? "27" : "68.5", sleeve: unit === "INCHES" ? "9" : "23" },
    ],
  };

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">FIT SPECIFICATIONS</span>
          <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">FLIQ SIZE GUIDE</h1>
        </div>

        {/* Unit Switcher */}
        <div className="flex items-center bg-white border border-zinc-300 p-1 rounded-sm shadow-xs">
          <button
            onClick={() => setUnit("INCHES")}
            className={`font-mono text-xs font-bold px-4 py-1.5 rounded-xs transition-colors cursor-pointer ${unit === "INCHES" ? "bg-bone text-white" : "text-zinc-600 hover:text-bone"}`}
          >
            INCHES (IN)
          </button>
          <button
            onClick={() => setUnit("CM")}
            className={`font-mono text-xs font-bold px-4 py-1.5 rounded-xs transition-colors cursor-pointer ${unit === "CM" ? "bg-bone text-white" : "text-zinc-600 hover:text-bone"}`}
          >
            CENTIMETERS (CM)
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 mb-8 overflow-x-auto pb-2">
        {(["HOODIES", "TEES", "SHIRTS", "PANTS"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-heading font-bold text-sm uppercase px-5 py-2.5 rounded-t-sm transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab ? "bg-bone text-white" : "bg-white text-bone hover:bg-zinc-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden mb-12 shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-obsidian border-b border-zinc-200 font-heading font-bold text-xs uppercase text-bone">
              <th className="py-4 px-6">SIZE</th>
              <th className="py-4 px-6">{activeTab === "PANTS" ? "WAIST" : "CHEST"} ({unit})</th>
              <th className="py-4 px-6">LENGTH ({unit})</th>
              <th className="py-4 px-6">{activeTab === "PANTS" ? "THIGH" : "SHOULDER"} ({unit})</th>
              <th className="py-4 px-6">{activeTab === "PANTS" ? "LEG OPENING" : "SLEEVE"} ({unit})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 font-mono text-sm">
            {measurements[activeTab].map((row) => (
              <tr key={row.size} className="hover:bg-zinc-50 transition-colors">
                <td className="py-4 px-6 font-bold text-acid">{row.size}</td>
                <td className="py-4 px-6">{row.chest}</td>
                <td className="py-4 px-6">{row.length}</td>
                <td className="py-4 px-6">{row.shoulder}</td>
                <td className="py-4 px-6">{row.sleeve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fit Advice Box */}
      <div className="bg-obsidian border border-zinc-200 p-6 sm:p-8 rounded-sm">
        <h3 className="font-heading font-bold text-lg uppercase text-bone mb-3 flex items-center gap-2">
          <Ruler size={20} className="text-acid" /> FIT PHILOSOPHY
        </h3>
        <ul className="space-y-2 text-xs text-zinc-600 font-body">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-acid shrink-0 mt-0.5" />
            <span><strong>OVERSIZED STREETWEAR FIT:</strong> Our hoodies and tees are designed boxy with dropped shoulders. Stick to your true size for the intended silhouette.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-acid shrink-0 mt-0.5" />
            <span><strong>SLIMMER SILHOUETTE:</strong> If you prefer a traditional tailored fit, size down by one full size.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
