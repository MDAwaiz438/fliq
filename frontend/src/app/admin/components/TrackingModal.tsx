"use client";

import { useEffect } from "react";
import { X, CheckCircle2, Clock, MapPin, ExternalLink, Package } from "lucide-react";

interface TrackingModalProps {
  order: {
    id: string;
    orderNumber: string;
    awbNumber?: string;
    courierName?: string;
    fulfillmentStatus: string;
    shippingAddress?: string;
  };
  onClose: () => void;
}

export default function TrackingModal({ order, onClose }: TrackingModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const steps = [
    { title: "Order Placed", date: "Aug 10, 10:24 AM", location: "FLIQ Warehouse, Mumbai", done: true },
    { title: "Pickup Scheduled", date: "Aug 10, 02:15 PM", location: "Shiprocket Hub, Bhiwandi", done: true },
    { title: "In Transit", date: "Aug 11, 09:40 AM", location: "Sorting Facility, Pune", done: true },
    { title: "Out for Delivery", date: "Aug 12, 08:15 AM", location: "Local Hub, Bengaluru", done: order.fulfillmentStatus === "DELIVERED" },
    { title: "Delivered", date: "Expected Today", location: order.shippingAddress || "Customer Address", done: order.fulfillmentStatus === "DELIVERED" }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <div className="bg-white border border-zinc-200 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="bg-zinc-900 px-5 py-3.5 border-b border-zinc-800 flex justify-between items-center text-white">
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">SHIPROCKET LIVE TRACKING</span>
            <h3 className="text-sm font-semibold text-white font-mono">AWB: {order.awbNumber || "SR-981240192"}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">

          {/* Courier Banner */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded flex justify-between items-center text-xs">
            <div className="flex items-center gap-2.5">
              <Package size={16} className="text-[#2271b1]" />
              <div>
                <span className="font-semibold text-blue-950 block">{order.courierName || "Delhivery Surface"}</span>
                <span className="text-[11px] text-blue-700 font-mono">Order #{order.orderNumber}</span>
              </div>
            </div>
            <a
              href={`https://shiprocket.co/tracking/${order.awbNumber || "SR-981240192"}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#2271b1] hover:underline flex items-center gap-1"
            >
              Shiprocket Portal <ExternalLink size={12} />
            </a>
          </div>

          {/* Timeline */}
          <div className="relative pl-5 border-l-2 border-zinc-200 flex flex-col gap-5 my-2">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col gap-0.5">
                <span className={`absolute -left-7 top-0 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 bg-white ${
                  step.done ? "border-emerald-500 text-emerald-500" : "border-zinc-300 text-zinc-300"
                }`}>
                  <CheckCircle2 size={11} fill={step.done ? "#10b981" : "white"} className={step.done ? "text-white" : "text-zinc-300"} />
                </span>

                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-xs ${step.done ? "text-zinc-900" : "text-zinc-400"}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                    <Clock size={10} /> {step.date}
                  </span>
                </div>

                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <MapPin size={11} className="text-[#2271b1] shrink-0" /> {step.location}
                </span>
              </div>
            ))}
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
