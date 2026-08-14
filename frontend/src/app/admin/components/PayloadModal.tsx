"use client";

import { X, Copy, Check, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

interface PayloadModalProps {
  log: {
    id: string;
    provider: string;
    topic: string;
    eventId: string;
    status: string;
    latencyMs: number;
    payload?: Record<string, unknown>;
  };
  onClose: () => void;
}

export default function PayloadModal({ log, onClose }: PayloadModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const jsonString = JSON.stringify(log.payload || {
    event_id: log.eventId || "sr_evt_981240182",
    topic: log.topic || "shiprocket/tracking_update",
    logistics_provider: "Shiprocket API v2",
    shipment_id: "SR-981240192",
    awb_code: "BD-44819201",
    courier_name: "BlueDart Express",
    current_status: "IN_TRANSIT",
    scanned_location: "Mumbai Hub",
    timestamp: new Date().toISOString(),
    customer: {
      email: "aarav.sharma@example.com",
      city: "Mumbai",
      pincode: "400001"
    },
    line_items: [
      {
        title: "Distortion Oversized Hoodie",
        sku: "FLQ-HOOD-03-BLK",
        quantity: 1,
        price: 3499
      }
    ]
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <div className="bg-white border border-zinc-200 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* Modal Header */}
        <div className="bg-zinc-900 px-5 py-3.5 border-b border-zinc-800 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-[#2271b1]" />
            <div>
              <span className="text-[10px] text-zinc-400 font-mono uppercase block">RAW EVENT PAYLOAD INSPECTOR</span>
              <h3 className="text-xs font-semibold text-white font-mono">{log.topic}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="p-4 sm:p-5 flex flex-col gap-3.5 overflow-y-auto max-h-[75vh]"
        >

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-50 p-2.5 border border-zinc-200 rounded text-xs font-mono">
            <div>
              <span className="text-zinc-400 text-[10px] block uppercase font-medium">Provider</span>
              <span className="font-bold text-zinc-900">{log.provider || "SHIPROCKET"}</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] block uppercase font-medium">Event ID</span>
              <span className="font-bold text-[#2271b1] truncate block">{log.eventId || "sr_evt_441209"}</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] block uppercase font-medium">Latency</span>
              <span className="font-bold text-emerald-600">{log.latencyMs || 8.4}ms</span>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative bg-zinc-950 text-zinc-100 p-3.5 rounded font-mono text-xs overflow-x-auto max-h-72 border border-zinc-800 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700">
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy JSON"}
            </button>
            <pre className="text-[11px]">{jsonString}</pre>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 border-t border-zinc-100 flex justify-end">
            <button
              onClick={onClose}
              className="h-8 px-4 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded shadow-xs cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
