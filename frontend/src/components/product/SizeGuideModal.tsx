"use client";

import { useState } from "react";
import { X, Ruler, Check, Info } from "lucide-react";

interface SizeGuideModalProps {
  category?: string;
  onClose: () => void;
}

export default function SizeGuideModal({ category = "SHIRTS", onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"CM" | "INCHES">("INCHES");

  const sizeChartData = [
    { size: "S", chestIn: "40 - 42", chestCm: "102 - 107", lengthIn: "27.5", lengthCm: "70", shoulderIn: "19.5", shoulderCm: "49.5" },
    { size: "M", chestIn: "42 - 44", chestCm: "107 - 112", lengthIn: "28.5", lengthCm: "72", shoulderIn: "20.5", shoulderCm: "52" },
    { size: "L", chestIn: "44 - 46", chestCm: "112 - 117", lengthIn: "29.5", lengthCm: "75", shoulderIn: "21.5", shoulderCm: "54.5" },
    { size: "XL", chestIn: "46 - 48", chestCm: "117 - 122", lengthIn: "30.5", lengthCm: "77", shoulderIn: "22.5", shoulderCm: "57" },
    { size: "XXL", chestIn: "48 - 50", chestCm: "122 - 127", lengthIn: "31.5", lengthCm: "80", shoulderIn: "23.5", shoulderCm: "59.5" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-body">
      <div className="bg-white border border-zinc-200 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-zinc-900 px-6 py-4 flex justify-between items-center text-white border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Ruler size={18} className="text-acid" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Garment Sizing & Fit Matrix</h3>
              <span className="text-[10px] text-zinc-400 font-mono">FLIQ Atelier // Relaxed Streetwear Silhouette</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Unit Toggle & Model Info */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-zinc-50 p-3.5 rounded-lg border border-zinc-200">
            <div>
              <span className="text-xs font-bold text-zinc-900 block">Model Fit Reference</span>
              <span className="text-xs text-zinc-500">Model is 6&apos;1&quot; (185cm), 74kg wearing size <strong>L (Large)</strong> for relaxed drape.</span>
            </div>

            {/* Toggle Unit */}
            <div className="flex bg-zinc-200 p-0.5 rounded-lg text-xs font-bold shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setUnit("INCHES")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  unit === "INCHES" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Inches (&quot;)
              </button>
              <button
                onClick={() => setUnit("CM")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  unit === "CM" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Sizing Table */}
          <div className="border border-zinc-200 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-100/80 border-b border-zinc-200 text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Chest Width</th>
                  <th className="px-4 py-3">Body Length</th>
                  <th className="px-4 py-3">Shoulder Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono">
                {sizeChartData.map((row) => (
                  <tr key={row.size} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-zinc-900 font-heading text-sm">{row.size}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">
                      {unit === "INCHES" ? `${row.chestIn}"` : `${row.chestCm} cm`}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {unit === "INCHES" ? `${row.lengthIn}"` : `${row.lengthCm} cm`}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {unit === "INCHES" ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring Instructions */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4 text-xs text-blue-900 flex items-start gap-2.5">
            <Info size={16} className="text-[#2271b1] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">How to Measure for Box Fit:</span>
              <p className="text-[11px] text-blue-800/90 leading-relaxed">
                Take your best-fitting casual shirt and lay it flat. Measure across the chest from armpit to armpit and compare with the table above. If in-between sizes, order your regular size for standard box-fit, or size up for an exaggerated oversized streetwear silhouette.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
