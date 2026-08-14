"use client";

import { useState, useEffect } from "react";
import { X, Truck, Check, Download, Sparkles } from "lucide-react";

interface CourierOption {
  id: string;
  name: string;
  rating: number;
  etd: string;
  rate: number;
  recommended?: boolean;
}

interface FulfillmentModalProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
  };
  onClose: () => void;
  onFulfillSuccess: (orderId: string, awb: string, courierName: string) => void;
}

const MOCK_COURIERS: CourierOption[] = [
  { id: "delhivery", name: "Delhivery Surface", rating: 4.8, etd: "3-4 Days", rate: 95, recommended: true },
  { id: "bluedart", name: "BlueDart Express", rating: 4.9, etd: "1-2 Days", rate: 165 },
  { id: "ecom_express", name: "Ecom Express", rating: 4.5, etd: "4-5 Days", rate: 80 },
  { id: "xpressbees", name: "XpressBees Direct", rating: 4.4, etd: "3-5 Days", rate: 85 }
];

export default function FulfillmentModal({ order, onClose, onFulfillSuccess }: FulfillmentModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const [selectedCourier, setSelectedCourier] = useState<string>("delhivery");
  const [loading, setLoading] = useState(false);
  const [awbGenerated, setAwbGenerated] = useState<string | null>(null);

  const handleGenerateAWB = () => {
    setLoading(true);
    setTimeout(() => {
      const mockAWB = "SR-" + Math.floor(100000000 + Math.random() * 900000000);
      const courierObj = MOCK_COURIERS.find(c => c.id === selectedCourier);
      setAwbGenerated(mockAWB);
      setLoading(false);
      onFulfillSuccess(order.id, mockAWB, courierObj?.name || "Delhivery");
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <div className="bg-white border border-zinc-200 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="bg-zinc-900 px-5 py-3.5 border-b border-zinc-800 flex justify-between items-center text-white">
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">SHIPROCKET LOGISTICS</span>
            <h3 className="text-sm font-semibold text-white">Fulfill Order #{order.orderNumber}</h3>
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

          {/* Order Details Summary */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded border border-zinc-200">
            <div>
              <span className="text-[10px] text-zinc-400 font-medium uppercase block">Customer</span>
              <span className="font-semibold text-zinc-900">{order.customerName}</span>
              <span className="text-zinc-500 block text-[11px]">{order.customerEmail}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-medium uppercase block">Destination</span>
              <span className="font-semibold text-zinc-900">{order.city}, {order.state}</span>
              <span className="text-zinc-500 block text-[11px]">PIN: {order.pincode} · {order.paymentMethod}</span>
            </div>
          </div>

          {!awbGenerated ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-zinc-800 flex items-center gap-1.5">
                    <Truck size={14} className="text-[#2271b1]" /> Select Recommended Courier
                  </h4>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                    Smart AI Routing Active
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {MOCK_COURIERS.map((c) => (
                    <label
                      key={c.id}
                      className={`flex justify-between items-center p-2.5 border rounded cursor-pointer transition-all ${
                        selectedCourier === c.id
                          ? "border-[#2271b1] bg-blue-50/40 ring-1 ring-[#2271b1]"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="courier"
                          checked={selectedCourier === c.id}
                          onChange={() => setSelectedCourier(c.id)}
                          className="accent-[#2271b1]"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-900">{c.name}</span>
                            {c.recommended && (
                              <span className="bg-[#2271b1] text-white text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                                BEST VALUE
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-500 text-[11px] block">Estimated delivery: {c.etd}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-zinc-900 text-xs">₹{c.rate}</span>
                        <span className="text-[10px] text-zinc-400 block">Rating: ⭐ {c.rating}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-zinc-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 px-3 rounded border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAWB}
                  disabled={loading}
                  className="h-8 px-4 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded shadow-xs cursor-pointer transition-colors"
                >
                  {loading ? "Generating AWB..." : "Create Shipment & AWB"}
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center text-center py-3 gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Check size={22} />
              </div>

              <div>
                <h4 className="font-bold text-sm text-emerald-900">Shipment Created Successfully</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Air Waybill (AWB) assigned via Shiprocket Engine.</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded w-full text-left text-xs flex justify-between items-center">
                <div>
                  <span className="text-zinc-400 text-[10px] font-medium uppercase block">Assigned AWB Number</span>
                  <span className="font-bold text-sm text-[#2271b1] font-mono">{awbGenerated}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 text-[10px] font-medium uppercase block">Courier</span>
                  <span className="font-semibold text-zinc-800">Delhivery Surface</span>
                </div>
              </div>

              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => alert(`Downloading Shipping Label PDF for AWB: ${awbGenerated}`)}
                  className="flex-1 h-8 bg-white hover:bg-zinc-50 border border-zinc-300 rounded font-medium text-zinc-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Download size={13} /> Download Label
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 h-8 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
