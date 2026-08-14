"use client";

import { useState, useEffect, useRef } from "react";
import { generateCode128Svg } from "@/utils/barcode";
import {
  Scan,
  Printer,
  Barcode as BarcodeIcon,
  CheckCircle,
  Package,
  Search,
  Plus,
  Minus,
  RefreshCw,
  Volume2
} from "lucide-react";

interface BarcodeSuiteProps {
  products: Array<{
    id: string;
    title: string;
    sku: string;
    price: number;
    inventoryQuantity: number;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    fulfillmentStatus: string;
    awbNumber?: string;
  }>;
  onUpdateInventory?: (sku: string, delta: number) => void;
}

export default function BarcodeSuite({ products, orders, onUpdateInventory }: BarcodeSuiteProps) {
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || "FLQ-HOOD-03-BLK");
  const [tagSize, setTagSize] = useState("L");
  const [scanInput, setScanInput] = useState("");
  const [lastScannedResult, setLastScannedResult] = useState<{
    type: "PRODUCT" | "ORDER" | "AWB" | "UNKNOWN";
    code: string;
    data?: any;
    timestamp: string;
  } | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanSuccessAnim, setScanSuccessAnim] = useState(false);
  const barcodeBuffer = useRef("");
  const lastKeyTime = useRef(0);

  const selectedProduct = products.find(p => p.sku === selectedSku) || products[0];

  // Play audio beep on successful scan
  const playBeep = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = 1400;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio Context beep error:", e);
    }
  };

  const processScannedCode = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) return;

    playBeep();
    setScanSuccessAnim(true);
    setTimeout(() => setScanSuccessAnim(false), 1200);

    // 1. Check if it's a Product SKU
    const matchedProduct = products.find(p => p.sku.toUpperCase() === code.toUpperCase() || p.id === code);
    if (matchedProduct) {
      setLastScannedResult({
        type: "PRODUCT",
        code,
        data: matchedProduct,
        timestamp: new Date().toLocaleTimeString()
      });
      setSelectedSku(matchedProduct.sku);
      return;
    }

    // 2. Check if it's an Order Number or AWB
    const matchedOrder = orders.find(
      o => o.orderNumber.toUpperCase() === code.toUpperCase() || (o.awbNumber && o.awbNumber.toUpperCase() === code.toUpperCase())
    );
    if (matchedOrder) {
      setLastScannedResult({
        type: matchedOrder.awbNumber?.toUpperCase() === code.toUpperCase() ? "AWB" : "ORDER",
        code,
        data: matchedOrder,
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    // 3. Unknown Code
    setLastScannedResult({
      type: "UNKNOWN",
      code,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // Hardware Scanner HID Keystroke Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "TEXTAREA") return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;
      lastKeyTime.current = currentTime;

      if (e.key === "Enter") {
        if (barcodeBuffer.current.length >= 3) {
          processScannedCode(barcodeBuffer.current);
          barcodeBuffer.current = "";
        }
      } else if (e.key.length === 1) {
        if (timeDiff > 120) {
          barcodeBuffer.current = "";
        }
        barcodeBuffer.current += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [products, orders]);

  // Generate SVG Code128 vector
  const barcodeData = generateCode128Svg(selectedSku, 55, 2);

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div
      className="flex flex-col gap-5 max-w-6xl animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Header Info */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarcodeIcon size={18} className="text-[#2271b1]" />
            <h2 className="text-sm font-semibold text-zinc-900">Barcode & Hardware Scanner Station</h2>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Connect any USB / Bluetooth barcode gun in HID mode for real-time inventory adjustments and shipping verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`h-7 px-3 rounded text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition-colors ${
              soundEnabled
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-zinc-100 text-zinc-600 border-zinc-200"
            }`}
          >
            <Volume2 size={13} /> {soundEnabled ? "Scanner Beep: Active" : "Muted"}
          </button>
        </div>
      </div>

      {/* Dual Column Station Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT: Scanner Receiver Station */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
            <h3 className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <Scan size={15} className="text-[#2271b1]" /> Hardware Gun Receiver Terminal
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Scanner Listening
            </span>
          </div>

          {/* Scanner Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processScannedCode(scanInput);
              setScanInput("");
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Scan with barcode gun or type SKU/AWB..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded pl-8 pr-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-[#2271b1] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-8 px-4 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded shadow-xs cursor-pointer transition-colors"
            >
              Scan
            </button>
          </form>

          {/* Scan Results Panel */}
          <div className={`border rounded-lg p-4 transition-all duration-200 ${
            scanSuccessAnim ? "bg-emerald-50 border-emerald-300 shadow-xs" : "bg-zinc-50 border-zinc-200"
          }`}>
            {lastScannedResult ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-zinc-500 font-mono">SCANNED AT: {lastScannedResult.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                    lastScannedResult.type === "PRODUCT" ? "bg-blue-50 text-blue-800 border-blue-200" :
                    lastScannedResult.type === "ORDER" ? "bg-purple-50 text-purple-800 border-purple-200" :
                    lastScannedResult.type === "AWB" ? "bg-amber-50 text-amber-800 border-amber-200" :
                    "bg-red-50 text-red-800 border-red-200"
                  }`}>
                    {lastScannedResult.type} MATCH
                  </span>
                </div>

                <div className="font-mono text-base font-bold text-zinc-900">
                  {lastScannedResult.code}
                </div>

                {/* Product Match Card */}
                {lastScannedResult.type === "PRODUCT" && lastScannedResult.data && (
                  <div className="bg-white border border-zinc-200 rounded-md p-3 text-xs flex flex-col gap-2 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-zinc-900">{lastScannedResult.data.title}</span>
                      <span className="font-bold text-[#2271b1] tabular-nums">₹{lastScannedResult.data.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-600">
                      <span>MongoDB Live Stock:</span>
                      <span className="font-bold text-emerald-600">{lastScannedResult.data.inventoryQuantity} UNITS</span>
                    </div>
                    {onUpdateInventory && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                        <button
                          onClick={() => onUpdateInventory(lastScannedResult.data.sku, -1)}
                          className="h-7 px-2.5 bg-zinc-100 hover:bg-zinc-200 rounded text-xs font-semibold text-zinc-700 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Minus size={12} /> Dispatch (-1)
                        </button>
                        <button
                          onClick={() => onUpdateInventory(lastScannedResult.data.sku, 1)}
                          className="h-7 px-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-xs font-semibold text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus size={12} /> Restock (+1)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Order / AWB Match Card */}
                {(lastScannedResult.type === "ORDER" || lastScannedResult.type === "AWB") && lastScannedResult.data && (
                  <div className="bg-white border border-zinc-200 rounded-md p-3 text-xs flex flex-col gap-1.5 shadow-xs">
                    <div className="flex justify-between font-semibold text-zinc-900">
                      <span>Order #{lastScannedResult.data.orderNumber}</span>
                      <span className="tabular-nums">₹{lastScannedResult.data.total}</span>
                    </div>
                    <div className="text-zinc-600">Customer: {lastScannedResult.data.customerName}</div>
                    <div className="text-zinc-600 font-mono text-[11px]">
                      AWB Code: {lastScannedResult.data.awbNumber || "Not assigned"}
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-zinc-100">
                      <span className="text-[11px] text-zinc-500">Status</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {lastScannedResult.data.fulfillmentStatus}
                      </span>
                    </div>
                  </div>
                )}

                {lastScannedResult.type === "UNKNOWN" && (
                  <div className="text-xs text-red-600 font-medium">
                    No matching Product SKU or Shiprocket AWB found for: <strong>{lastScannedResult.code}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400 text-xs flex flex-col items-center gap-2">
                <Scan size={26} className="text-zinc-300" />
                <span>Pull the trigger on your handheld barcode gun to scan immediately.</span>
              </div>
            )}
          </div>

          {/* Quick Simulation Buttons */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-500 font-medium">Click to test simulation scan:</span>
            <div className="flex flex-wrap gap-1.5">
              {products.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => processScannedCode(p.sku)}
                  className="h-6 px-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-mono rounded cursor-pointer transition-colors"
                >
                  {p.sku}
                </button>
              ))}
              {orders.slice(0, 2).map((o) => (
                <button
                  key={o.id}
                  onClick={() => processScannedCode(o.awbNumber || o.orderNumber)}
                  className="h-6 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-mono rounded cursor-pointer transition-colors"
                >
                  {o.awbNumber || o.orderNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Barcode Label & Hangtag Generator */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
            <h3 className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <BarcodeIcon size={15} className="text-[#2271b1]" /> Garment Hangtag & Label Generator
            </h3>
            <button
              onClick={handlePrintLabel}
              className="h-7 px-3 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-medium rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Printer size={13} /> Print Label Tag
            </button>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-medium text-zinc-600 block mb-1">Select Garment SKU</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.sku}>
                    {p.sku} — {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-zinc-600 block mb-1">Garment Size</label>
              <select
                value={tagSize}
                onChange={(e) => setTagSize(e.target.value)}
                className="w-full border border-zinc-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
              >
                <option value="S">Size S</option>
                <option value="M">Size M</option>
                <option value="L">Size L</option>
                <option value="XL">Size XL</option>
              </select>
            </div>
          </div>

          {/* Thermal Tag Preview Box */}
          <div className="border border-dashed border-zinc-300 bg-zinc-50/60 p-5 rounded-lg flex items-center justify-center">
            <div className="bg-white border border-zinc-300 shadow-md p-4 w-72 rounded flex flex-col items-center gap-2 text-center print:shadow-none print:border-none print:w-full">
              {/* Brand Header */}
              <div className="border-b border-zinc-900 w-full pb-1">
                <span className="font-bold tracking-widest text-sm text-zinc-900 block">FLIQ</span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">RAW · EDGE · NOW</span>
              </div>

              {/* Garment Title */}
              <div className="text-xs font-bold text-zinc-900 mt-0.5 uppercase leading-tight line-clamp-1">
                {selectedProduct?.title || "STREETWEAR GARMENT"}
              </div>

              {/* Size and MRP */}
              <div className="flex justify-between w-full text-xs font-mono px-2.5 py-1 bg-zinc-100 rounded">
                <span>SIZE: <strong>{tagSize}</strong></span>
                <span>MRP: <strong>₹{selectedProduct?.price?.toLocaleString() || "3,499"}</strong></span>
              </div>

              {/* Vector Barcode Render */}
              <div className="my-1 w-full flex flex-col items-center">
                <svg
                  viewBox={`0 0 ${barcodeData.totalWidth} 55`}
                  className="w-full h-12 max-w-55"
                  style={{ shapeRendering: "crispEdges" }}
                >
                  <path d={barcodeData.svgPath} fill="#000000" />
                </svg>
                <span className="font-mono text-[11px] tracking-widest text-zinc-800 font-bold mt-1">
                  {selectedSku}
                </span>
              </div>

              <div className="text-[9px] text-zinc-400 font-mono border-t border-zinc-100 w-full pt-1">
                100% COTTON · MADE IN INDIA · VERIFIED AUTHENTIC
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
