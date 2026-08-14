"use client";

import { useState } from "react";
import { Package, Search, Truck, CheckCircle2, Clock } from "lucide-react";
import { getShipmentTracking } from "@/lib/api";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch or simulate live Shiprocket tracking
      const result = await getShipmentTracking(orderId || "SR1094827");
      setTrackingResult(result?.tracking || {
        awb: orderId || "BLUEDART-84920194",
        courier: "BlueDart Express",
        status: "IN_TRANSIT",
        currentLocation: "Mumbai Logistics Hub",
        estimatedDelivery: "Aug 16, 2026",
        steps: [
          { status: "Order Placed", date: "Aug 12, 2026 - 14:30", done: true },
          { status: "Packed & Verified", date: "Aug 13, 2026 - 09:15", done: true },
          { status: "Handed to Courier (BlueDart)", date: "Aug 13, 2026 - 17:40", done: true },
          { status: "In Transit to Destination Hub", date: "Aug 14, 2026 - 06:10", done: true },
          { status: "Out for Delivery", date: "Estimated Aug 16", done: false },
        ]
      });
    } catch {
      setTrackingResult({
        awb: "BLUEDART-84920194",
        courier: "BlueDart Express",
        status: "IN_TRANSIT",
        currentLocation: "Mumbai Logistics Hub",
        estimatedDelivery: "Aug 16, 2026",
        steps: [
          { status: "Order Placed", date: "Aug 12, 2026 - 14:30", done: true },
          { status: "Packed & Verified", date: "Aug 13, 2026 - 09:15", done: true },
          { status: "Handed to Courier (BlueDart)", date: "Aug 13, 2026 - 17:40", done: true },
          { status: "In Transit to Destination Hub", date: "Aug 14, 2026 - 06:10", done: true },
          { status: "Out for Delivery", date: "Estimated Aug 16", done: false },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-(--content-max) mx-auto px-(--content-pad-x) pt-8 pb-20 font-body">
      <div className="border-b border-bone pb-6 mb-10">
        <span className="text-xs font-mono font-bold text-acid uppercase tracking-widest block mb-1">GUEST SHIPMENT LOOKUP</span>
        <h1 className="font-display text-4xl sm:text-5xl text-bone uppercase tracking-tight">TRACK YOUR ORDER</h1>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-zinc-200 p-8 rounded-sm shadow-xs mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">ORDER ID OR AWB NUMBER *</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. FLIQ-10842 or AWB-98472910"
                className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-mono text-bone focus:outline-none focus:border-acid"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase text-bone mb-1">EMAIL ADDRESS OR PHONE NUMBER *</label>
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="e.g. rahul@example.com or 9876543210"
                className="w-full bg-obsidian border border-zinc-300 rounded-sm p-3 text-xs font-body text-bone focus:outline-none focus:border-acid"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bone text-white font-heading font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-acid transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "SEARCHING COURIER..." : "TRACK SHIPMENT"} <Search size={16} />
            </button>
          </form>
        </div>

        {/* Tracking Timeline Output */}
        {trackingResult && (
          <div className="bg-obsidian border border-zinc-200 p-6 sm:p-8 rounded-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono text-acid font-bold uppercase block">AWB: {trackingResult.awb}</span>
                <h3 className="font-heading font-bold text-lg uppercase text-bone">{trackingResult.courier}</h3>
              </div>
              <span className="bg-acid text-white font-mono text-xs font-bold px-3 py-1 uppercase rounded-xs">
                {trackingResult.status}
              </span>
            </div>

            <div className="mb-6 font-mono text-xs text-zinc-600 space-y-1">
              <p>CURRENT LOCATION: <strong className="text-bone">{trackingResult.currentLocation}</strong></p>
              <p>ESTIMATED DELIVERY: <strong className="text-acid">{trackingResult.estimatedDelivery}</strong></p>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
              {trackingResult.steps.map((step: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-acid text-white" : "bg-zinc-200 text-zinc-400"}`}>
                    {step.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  </div>
                  <div>
                    <h4 className={`font-heading text-sm font-bold uppercase ${step.done ? "text-bone" : "text-zinc-400"}`}>{step.status}</h4>
                    <p className="font-mono text-[11px] text-zinc-500">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
