"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebar from "./components/AdminSidebar";
import AdminToolbar from "./components/AdminToolbar";
import FulfillmentModal from "./components/FulfillmentModal";
import TrackingModal from "./components/TrackingModal";
import PayloadModal from "./components/PayloadModal";
import ProductEditorView from "./components/ProductEditorView";
import BarcodeSuite from "./components/BarcodeSuite";
import AnalyticsReports from "./components/AnalyticsReports";
import StoreSettings from "./components/StoreSettings";
import CategoriesManager from "./components/CategoriesManager";
import {
  getAllProductsSync,
  fetchAllProducts,
  deleteProductFromStorage
} from "@/lib/products";
import { BACKEND_URL } from "@/lib/api";
import {
  Package,
  Truck,
  Users,
  Plus,
  Search,
  Filter,
  DollarSign,
  ChevronRight
} from "lucide-react";

// ---- Types ----

interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  city: string;
  state: string;
  pincode: string;
  total: number;
  paymentMethod: "PREPAID" | "COD";
  financialStatus: "PAID" | "PENDING";
  fulfillmentStatus: "UNFULFILLED" | "READY_FOR_PICKUP" | "IN_TRANSIT" | "DELIVERED";
  syncStatus: "SYNCED" | "PENDING" | "FAILED";
  awbNumber?: string;
  courierName?: string;
  createdAt: string;
  itemsCount: number;
  itemTitle?: string;
  itemImage?: string;
}

interface MockProduct {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventoryQuantity: number;
  syncStatus: "SYNCED" | "PENDING" | "FAILED";
  lastSyncedAt: string;
  image: string;
  category?: string;
  unitsSold?: number;
}

interface MockWebhookLog {
  id: string;
  provider: "SHIPROCKET" | "MONGODB" | "FLIQ";
  topic: string;
  eventId: string;
  status: "PROCESSED" | "FAILED" | "RETRYING";
  latencyMs: number;
  createdAt: string;
  payload: Record<string, unknown>;
}

interface MockCustomer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  state: string;
  avatar: string;
}

// ---- Main Component ----

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [salesTimeframe, setSalesTimeframe] = useState<"7d" | "30d" | "1y">("30d");
  const [orderFilter, setOrderFilter] = useState("ALL");

  // Modals & Sub-views
  const [selectedFulfillOrder, setSelectedFulfillOrder] = useState<MockOrder | null>(null);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<MockOrder | null>(null);
  const [selectedWebhookLog, setSelectedWebhookLog] = useState<MockWebhookLog | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MockProduct | null>(null);

  // ---- Mock Data ----
  const [orders, setOrders] = useState<MockOrder[]>([
    {
      id: "ord_1",
      orderNumber: "FLQ-84920",
      customerName: "Liam Chen",
      customerEmail: "liam.chen@atelier.com",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      total: 3499,
      paymentMethod: "PREPAID",
      financialStatus: "PAID",
      fulfillmentStatus: "UNFULFILLED",
      syncStatus: "SYNCED",
      createdAt: "10 mins ago",
      itemsCount: 1,
      itemTitle: "Distortion Oversized Hoodie",
      itemImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "ord_2",
      orderNumber: "FLQ-84919",
      customerName: "Aarav Sharma",
      customerEmail: "aarav.sharma@example.com",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      total: 6998,
      paymentMethod: "PREPAID",
      financialStatus: "PAID",
      fulfillmentStatus: "IN_TRANSIT",
      syncStatus: "SYNCED",
      awbNumber: "SR-981240192",
      courierName: "Delhivery Surface",
      createdAt: "1 hour ago",
      itemsCount: 2,
      itemTitle: "Cyberpunk Box Fit Graphic Tee",
      itemImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "ord_3",
      orderNumber: "FLQ-84918",
      customerName: "Rohan Gupta",
      customerEmail: "rohan.g@example.com",
      city: "Delhi NCR",
      state: "Delhi",
      pincode: "110001",
      total: 4299,
      paymentMethod: "COD",
      financialStatus: "PENDING",
      fulfillmentStatus: "READY_FOR_PICKUP",
      syncStatus: "SYNCED",
      awbNumber: "BD-44819201",
      courierName: "BlueDart Express",
      createdAt: "3 hours ago",
      itemsCount: 1,
      itemTitle: "Tactical Multi-Pocket Cargo Pants",
      itemImage: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "ord_4",
      orderNumber: "FLQ-84917",
      customerName: "Ananya Iyer",
      customerEmail: "ananya.iyer@example.com",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
      total: 2499,
      paymentMethod: "PREPAID",
      financialStatus: "PAID",
      fulfillmentStatus: "DELIVERED",
      syncStatus: "SYNCED",
      awbNumber: "XB-88210492",
      courierName: "XpressBees Direct",
      createdAt: "1 day ago",
      itemsCount: 1,
      itemTitle: "Distortion Oversized Hoodie",
      itemImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop"
    },
  ]);

  const mapAndDeduplicateProducts = (rawList: any[]): MockProduct[] => {
    const seen = new Set<string>();
    const result: MockProduct[] = [];
    for (const p of rawList) {
      const pid = p.id || `prod_${p.slug || Math.random()}`;
      if (!seen.has(pid)) {
        seen.add(pid);
        result.push({
          id: pid,
          title: p.title,
          sku: p.sku || `FLQ-${(p.category || "PROD").slice(0, 4)}-${pid.slice(-3)}`,
          price: p.price,
          inventoryQuantity: p.inventoryQuantity ?? 25,
          syncStatus: "SYNCED",
          lastSyncedAt: "Just now",
          image: p.image || (p.images && p.images[0]) || "/images/product_distortion.png",
          unitsSold: 45
        });
      }
    }
    return result;
  };

  const [products, setProducts] = useState<MockProduct[]>(() => {
    const all = getAllProductsSync();
    return mapAndDeduplicateProducts(all);
  });

  useEffect(() => {
    const refreshProducts = () => {
      const all = getAllProductsSync();
      setProducts(mapAndDeduplicateProducts(all));
    };

    refreshProducts();

    fetchAllProducts().then((latest) => {
      setProducts(mapAndDeduplicateProducts(latest));
    });

    window.addEventListener("fliq_products_updated", refreshProducts);
    return () => window.removeEventListener("fliq_products_updated", refreshProducts);
  }, []);

  const [webhookLogs, setWebhookLogs] = useState<MockWebhookLog[]>([
    { id: "log_1", provider: "SHIPROCKET", topic: "shipment.tracking_update", eventId: "sr_evt_991824", status: "PROCESSED", latencyMs: 8.4, createdAt: "10 mins ago", payload: { order_id: "FLQ-84920", awb: "BD-44819201", status: "IN_TRANSIT", location: "Mumbai Hub", courier: "BlueDart Express" } },
    { id: "log_2", provider: "SHIPROCKET", topic: "order.awb_assigned", eventId: "sr_evt_441209", status: "PROCESSED", latencyMs: 12.1, createdAt: "45 mins ago", payload: { order_id: "FLQ-84919", awb: "DEL-981240192", status: "READY_FOR_PICKUP", courier: "Delhivery Surface" } },
    { id: "log_3", provider: "MONGODB", topic: "inventory.stock_level_sync", eventId: "mdb_evt_883201", status: "PROCESSED", latencyMs: 14.2, createdAt: "1 hour ago", payload: { sku: "FLQ-HOOD-03-BLK", updated_stock: 42, cluster: "fliq.6fqxaqp.mongodb.net", status: "SYNCED_LIVE" } },
  ]);

  const [customers] = useState<MockCustomer[]>([
    { id: "cust_1", name: "Liam Chen", email: "liam.chen@atelier.com", ordersCount: 6, totalSpent: 24994, state: "Maharashtra", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" },
    { id: "cust_2", name: "Aarav Sharma", email: "aarav.sharma@example.com", ordersCount: 5, totalSpent: 18995, state: "Maharashtra", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
    { id: "cust_3", name: "Priya Nair", email: "priya.nair@example.com", ordersCount: 4, totalSpent: 14496, state: "Karnataka", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop" },
  ]);

  // ---- Handlers ----
  const handleDeleteProduct = async (productId: string) => {
    deleteProductFromStorage(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await fetch(`${BACKEND_URL}/api/admin/products/${productId}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Deleted locally:", e);
    }
  };

  const handleFulfillSuccess = (orderId: string, awb: string, courierName: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillmentStatus: "READY_FOR_PICKUP" as const, awbNumber: awb, courierName } : o));
  };
  const handleRetryWebhook = (logId: string) => {
    setWebhookLogs(prev => prev.map(l => l.id === logId ? { ...l, status: "PROCESSED" as const } : l));
  };
  const handleUpdateInventory = (sku: string, delta: number) => {
    setProducts(prev => prev.map(p => p.sku === sku ? {
      ...p,
      inventoryQuantity: Math.max(0, p.inventoryQuantity + delta)
    } : p));
  };

  const filteredOrders = orders.filter(o => orderFilter === "ALL" || o.fulfillmentStatus === orderFilter);

  // ---- Table Styles ----
  const th = "px-4 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/70 border-b border-zinc-200/80 text-left";
  const td = "px-4 py-3.5 text-xs text-zinc-800 border-b border-zinc-100 align-middle";

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      UNFULFILLED: "bg-amber-50 text-amber-800 border-amber-200",
      READY_FOR_PICKUP: "bg-sky-50 text-sky-800 border-sky-200",
      IN_TRANSIT: "bg-purple-50 text-purple-800 border-purple-200",
      DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
    return map[s] || "bg-zinc-50 text-zinc-700 border-zinc-200";
  };

  // ---- Page Meta Info ----
  const pageMeta: Record<string, { title: string; desc?: string }> = {
    dashboard: { title: "Dashboard Command", desc: "Real-time store performance & fulfillment" },
    reports: { title: "Executive Analytics", desc: "Velocity metrics & Excel spreadsheets" },
    orders: { title: "Orders Command", desc: `Managing ${filteredOrders.length} customer orders` },
    products: { title: "Garment Catalog", desc: `${products.length} products published in MongoDB` },
    barcodes: { title: "Barcode Scanner Hub", desc: "Physical scanner listener & thermal hangtags" },
    customers: { title: "Customer Intelligence", desc: "LTV tiers & customer retention" },
    shipping: { title: "Logistics & AWBs", desc: "Shiprocket API integration settings" },
    webhooks: { title: "Webhook Radar", desc: "Real-time inbound event delivery queue" },
    settings: { title: "Store Settings", desc: "Taxes, GST rules & MongoDB security" },
  };

  const meta = pageMeta[activeSection] || pageMeta.dashboard;

  return (
    <div
      className="min-h-screen bg-zinc-50 text-zinc-900 flex"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Left Modern Docked Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onNavigate={(sec) => {
          setActiveSection(sec);
          setIsAddingProduct(false);
          setEditingProduct(null);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-200 min-h-screen flex-1 flex flex-col ${sidebarCollapsed ? "ml-16" : "ml-60"}`}>
        
        {/* Global Command Bar */}
        <AdminToolbar
          pageTitle={meta.title}
          pageDescription={meta.desc}
          onNewProduct={() => {
            setActiveSection("products");
            setIsAddingProduct(true);
            setEditingProduct(null);
          }}
        />

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">

          {/* ============ 1. BRAND OS DASHBOARD OVERVIEW ============ */}
          {activeSection === "dashboard" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-150">

              {/* Top 3 KPI Sparkline Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* KPI 1: TOTAL REVENUE */}
                <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                        TOTAL REVENUE
                      </span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-bold text-zinc-900 tracking-tight">₹4,89,200</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                          ↑ 18.4%
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-1 block">Yesterday: ₹3,92,400</span>
                    </div>

                    {/* Sparkline Graphic */}
                    <div className="w-24 h-10">
                      <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="spark1" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 30 Q20 5 40 20 T80 5 T100 15"
                          fill="none"
                          stroke="url(#spark1)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* KPI 2: ACTIVE ORDERS */}
                <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                        ACTIVE ORDERS
                      </span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-bold text-zinc-900 tracking-tight">148</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          +12 today
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-1 block">92% Fulfillment / 12 Expedited</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <Package size={20} />
                    </div>
                  </div>
                </div>

                {/* KPI 3: AVERAGE ORDER VALUE */}
                <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                        AVG ORDER VALUE (AOV)
                      </span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-bold text-zinc-900 tracking-tight">₹3,445</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          +5.1%
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-1 block">Streetwear premium tier</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign size={20} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Middle Section: Gradient Sales Curve + Recent Drop Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                {/* Main Interactive Gradient Curve (66%) */}
                <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">MONTHLY SALES REVENUE</h3>
                      <p className="text-xs text-zinc-500">Gross performance across FLIQ Atelier Webstore</p>
                    </div>

                    <select
                      value={salesTimeframe}
                      onChange={(e) => setSalesTimeframe(e.target.value as any)}
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-800 outline-none cursor-pointer"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">This Month</option>
                      <option value="1y">This Year</option>
                    </select>
                  </div>

                  {/* Gradient Area Chart */}
                  <div className="h-56 w-full pt-3 relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradientWave" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="50%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d="M0 130 Q80 110 140 80 T260 40 T380 90 T450 20 L500 50 L500 160 L0 160 Z"
                        fill="url(#areaFill)"
                      />

                      {/* Gradient Wave Line */}
                      <path
                        d="M0 130 Q80 110 140 80 T260 40 T380 90 T450 20 L500 50"
                        fill="none"
                        stroke="url(#gradientWave)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Spark Dots */}
                      {[
                        { cx: 0, cy: 130 },
                        { cx: 140, cy: 80 },
                        { cx: 260, cy: 40 },
                        { cx: 450, cy: 20 },
                        { cx: 500, cy: 50 }
                      ].map((pt, i) => (
                        <circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#FFFFFF" stroke="#f43f5e" strokeWidth="2.5" />
                      ))}
                    </svg>

                    {/* Interactive Tooltip Pin */}
                    <div className="absolute right-12 top-2 bg-zinc-900 text-white rounded-lg px-2.5 py-1 text-center shadow-lg pointer-events-none">
                      <span className="text-[10px] text-zinc-400 font-mono block">Oct 24</span>
                      <span className="text-xs font-bold block">₹19,540</span>
                      <span className="text-[9px] text-zinc-400 block">31 orders</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono border-t border-zinc-100 pt-2">
                    <span>Oct 1</span>
                    <span>Oct 7</span>
                    <span>Oct 14</span>
                    <span>Oct 21</span>
                    <span>Oct 28</span>
                  </div>
                </div>

                {/* Right: Recent Drop Performance Cards (34%) */}
                <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-3.5">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      RECENT DROP PERFORMANCE
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Trending drop garment cards</p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {products.slice(0, 3).map((prod, idx) => (
                      <div
                        key={`${prod.id}_${idx}`}
                        onClick={() => {
                          setActiveSection("products");
                          setEditingProduct(prod);
                        }}
                        className="p-3 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50/70 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                          <div className="w-10 h-12 bg-zinc-100 rounded-lg overflow-hidden relative shrink-0 border border-zinc-200 shadow-2xs">
                            <Image src={prod.image} alt={prod.title} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1 truncate">
                              {prod.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                              <span className="font-bold text-zinc-900">₹{prod.price.toLocaleString()}</span>
                              <span>·</span>
                              <span>{prod.unitsSold || 45} Sold</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            prod.inventoryQuantity <= 5
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {prod.inventoryQuantity <= 5 ? "Low Stock" : "In Stock"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveSection("products")}
                    className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg text-center cursor-pointer transition-colors mt-1"
                  >
                    View Full Drop Catalog →
                  </button>
                </div>

              </div>

              {/* Bottom Section: Order Fulfillment Table */}
              <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      ORDER FULFILLMENT PIPELINE
                    </h3>
                    <p className="text-xs text-zinc-500">Live order queue with 1-click Shiprocket fulfillment</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSection("orders")}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      View all {orders.length} orders →
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className={th}>Order ID</th>
                        <th className={th}>Customer</th>
                        <th className={th}>Date</th>
                        <th className={th}>Item Drop</th>
                        <th className={th}>Total</th>
                        <th className={th}>Status</th>
                        <th className={`${th} text-right`}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-50/70 transition-colors">
                          <td className={`${td} font-bold text-zinc-900`}>{order.orderNumber}</td>
                          <td className={td}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                                {order.customerName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-semibold text-zinc-900 block">{order.customerName}</span>
                                <span className="text-[10px] text-zinc-400">{order.customerEmail}</span>
                              </div>
                            </div>
                          </td>
                          <td className={`${td} text-zinc-500 text-[11px]`}>{order.createdAt}</td>
                          <td className={td}>
                            <div className="flex items-center gap-2">
                              {order.itemImage && (
                                <div className="w-6 h-8 bg-zinc-100 rounded overflow-hidden relative shrink-0 border border-zinc-200">
                                  <Image src={order.itemImage} alt="item" fill className="object-cover" />
                                </div>
                              )}
                              <span className="font-medium text-zinc-800 truncate max-w-40">{order.itemTitle || "Drop Garment"}</span>
                            </div>
                          </td>
                          <td className={`${td} font-bold text-zinc-900 tabular-nums`}>₹{order.total.toLocaleString()}</td>
                          <td className={td}>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(order.fulfillmentStatus)}`}>
                              {order.fulfillmentStatus.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className={`${td} text-right`}>
                            {order.fulfillmentStatus === "UNFULFILLED" ? (
                              <button
                                onClick={() => setSelectedFulfillOrder(order)}
                                className="h-7 px-3 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
                              >
                                Fulfill Now
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedTrackOrder(order)}
                                className="h-7 px-2.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                              >
                                Track AWB
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============ 2. EXECUTIVE ANALYTICS & SPREADSHEET REPORTS ============ */}
          {activeSection === "reports" && (
            <AnalyticsReports products={products} orders={orders} />
          )}

          {/* ============ 3. ORDERS MANAGEMENT ============ */}
          {activeSection === "orders" && (
            <div className="flex flex-col gap-5 max-w-6xl animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 border border-zinc-200/80 rounded-xl shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-500 mr-1 flex items-center gap-1">
                    <Filter size={13} /> Filter:
                  </span>
                  {["ALL", "UNFULFILLED", "READY_FOR_PICKUP", "IN_TRANSIT", "DELIVERED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        orderFilter === st
                          ? "bg-zinc-900 text-white shadow-xs"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {st === "ALL" ? "All Orders" : st.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-zinc-500 font-medium">Showing {filteredOrders.length} orders</span>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className={th}>Order</th>
                      <th className={th}>Customer</th>
                      <th className={th}>Destination</th>
                      <th className={th}>Payment</th>
                      <th className={th}>Total</th>
                      <th className={th}>Status</th>
                      <th className={`${th} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className={`${td} font-bold text-zinc-900`}>{order.orderNumber}</td>
                        <td className={td}>
                          <span className="font-semibold text-zinc-900 block">{order.customerName}</span>
                          <span className="text-[11px] text-zinc-500">{order.customerEmail}</span>
                        </td>
                        <td className={td}>
                          <span className="text-zinc-800">{order.city}, {order.state}</span>
                          <span className="text-[11px] text-zinc-400 block font-mono">PIN: {order.pincode}</span>
                        </td>
                        <td className={td}>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            order.paymentMethod === "PREPAID"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className={`${td} font-bold text-zinc-900 tabular-nums`}>₹{order.total.toLocaleString()}</td>
                        <td className={td}>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusBadge(order.fulfillmentStatus)}`}>
                            {order.fulfillmentStatus.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className={`${td} text-right`}>
                          {order.fulfillmentStatus === "UNFULFILLED" ? (
                            <button
                              onClick={() => setSelectedFulfillOrder(order)}
                              className="h-7 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                            >
                              Fulfill via Shiprocket
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedTrackOrder(order)}
                              className="h-7 px-3 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                            >
                              Track AWB ({order.courierName || "Courier"})
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ 4. PRODUCT CATALOG & FULL-PAGE STUDIO ============ */}
          {activeSection === "products" && !isAddingProduct && !editingProduct && (
            <div className="flex flex-col gap-5 max-w-6xl animate-in fade-in duration-150">
              <div className="flex justify-between items-center bg-white p-4 border border-zinc-200/80 rounded-xl shadow-xs">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Garment Drops & Catalog Studio</h2>
                  <p className="text-xs text-zinc-500">Live products queried directly from MongoDB Atlas</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingProduct(true);
                    setEditingProduct(null);
                  }}
                  className="h-8 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <Plus size={14} /> Add New Garment
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className={`${th} w-8`}><input type="checkbox" className="rounded" /></th>
                      <th className={th}>Product</th>
                      <th className={th}>SKU</th>
                      <th className={th}>Price</th>
                      <th className={th}>Stock Level</th>
                      <th className={th}>Database Sync</th>
                      <th className={th}>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => (
                      <tr key={`${product.id}_${idx}`} className="hover:bg-zinc-50/70 group transition-colors">
                        <td className={td}><input type="checkbox" className="rounded" /></td>
                        <td className={td}>
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-14 bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden relative shrink-0">
                              <Image src={product.image} alt={product.title} fill className="object-cover" />
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsAddingProduct(false);
                                }}
                                className="font-bold text-zinc-900 hover:text-blue-600 cursor-pointer text-left block text-xs"
                              >
                                {product.title}
                              </button>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                                <button
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setIsAddingProduct(false);
                                  }}
                                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                                >
                                  Edit
                                </button>
                                <span>|</span>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:underline font-semibold cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`${td} font-mono text-zinc-500 text-[11px]`}>{product.sku}</td>
                        <td className={`${td} font-bold text-zinc-900 tabular-nums`}>₹{product.price.toLocaleString()}</td>
                        <td className={td}>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            product.inventoryQuantity > 10
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : product.inventoryQuantity > 0
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}>
                            {product.inventoryQuantity} in stock
                          </span>
                        </td>
                        <td className={td}>
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            MongoDB Live
                          </span>
                        </td>
                        <td className={`${td} text-zinc-500 text-[11px]`}>{product.lastSyncedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ 4. FULL-PAGE DEDICATED PRODUCT STUDIO (ADD / EDIT) ============ */}
          {activeSection === "products" && (isAddingProduct || editingProduct) && (
            <ProductEditorView
              initialProduct={editingProduct}
              onBack={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
              onSave={(savedProduct) => {
                if (editingProduct) {
                  setProducts((prev) =>
                    prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
                  );
                } else {
                  setProducts((prev) => [savedProduct, ...prev]);
                }
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
            />
          )}

          {/* ============ 5. BARCODES & HARDWARE SCANNER ============ */}
          {activeSection === "barcodes" && (
            <BarcodeSuite
              products={products}
              orders={orders}
              onUpdateInventory={handleUpdateInventory}
            />
          )}

          {/* ============ 4B. FEATURED CATEGORIES HUB ============ */}
          {activeSection === "categories" && (
            <div className="max-w-6xl animate-in fade-in duration-150">
              <CategoriesManager />
            </div>
          )}

          {/* ============ 6. CUSTOMER INTELLIGENCE ============ */}
          {activeSection === "customers" && (
            <div className="flex flex-col gap-5 max-w-6xl animate-in fade-in duration-150">
              <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className={th}>Customer</th>
                      <th className={th}>State Location</th>
                      <th className={th}>Orders Count</th>
                      <th className={th}>Lifetime Value (LTV)</th>
                      <th className={`${th} text-right`}>Loyalty VIP Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust, idx) => (
                      <tr key={cust.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className={`${td} flex items-center gap-3`}>
                          <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 border border-zinc-200">
                            <Image src={cust.avatar} alt={cust.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 block text-xs">{cust.name}</span>
                            <span className="text-[11px] text-zinc-500">{cust.email}</span>
                          </div>
                        </td>
                        <td className={`${td} text-zinc-700`}>{cust.state}</td>
                        <td className={`${td} font-bold text-zinc-900 tabular-nums`}>{cust.ordersCount} orders</td>
                        <td className={`${td} font-bold text-zinc-900 tabular-nums text-sm`}>₹{cust.totalSpent.toLocaleString()}</td>
                        <td className={`${td} text-right`}>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold border ${
                            idx === 0 ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-zinc-100 text-zinc-700 border-zinc-200"
                          }`}>
                            Tier {idx + 1} VIP
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ 7. SHIPPING & LOGISTICS ============ */}
          {activeSection === "shipping" && (
            <div className="max-w-2xl flex flex-col gap-5 animate-in fade-in duration-150">
              <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 bg-zinc-50/70 border-b border-zinc-200">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Shiprocket Logistics Configuration</h3>
                </div>
                <div className="p-5 flex flex-col gap-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-500 font-medium">Shiprocket API Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected & Authenticated
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-500 font-medium">Primary Warehouse</span>
                    <span className="font-semibold text-zinc-900">Primary Warehouse (Mumbai Central Hub)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-500 font-medium">Enabled Express Couriers</span>
                    <span className="font-medium text-zinc-800">BlueDart Air, Delhivery Surface, DTDC Air, XpressBees</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-500 font-medium">Authentication Token</span>
                    <span className="font-mono text-zinc-400">JWT Token Active (Auto-refresh 24h)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ 8. WEBHOOK RADAR ============ */}
          {activeSection === "webhooks" && (
            <div className="flex flex-col gap-5 max-w-6xl animate-in fade-in duration-150">
              <div className="flex justify-between items-center bg-white p-4 border border-zinc-200/80 rounded-xl shadow-xs">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Inbound Webhook Event Radar</h2>
                  <p className="text-xs text-zinc-500">Live webhook payloads with BullMQ automated retry processing</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Radar Active
                </span>
              </div>

              <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className={th}>Provider</th>
                      <th className={th}>Event Topic</th>
                      <th className={th}>Event ID</th>
                      <th className={th}>Latency</th>
                      <th className={th}>Status</th>
                      <th className={`${th} text-right`}>Payload Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhookLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50/70 transition-colors">
                        <td className={`${td} font-bold text-zinc-900`}>{log.provider}</td>
                        <td className={`${td} text-blue-600 font-mono`}>{log.topic}</td>
                        <td className={`${td} text-zinc-400 font-mono text-[11px]`}>{log.eventId}</td>
                        <td className={`${td} text-emerald-600 font-mono`}>{log.latencyMs}ms</td>
                        <td className={td}>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.status === "PROCESSED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className={`${td} text-right`}>
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedWebhookLog(log)}
                              className="h-7 px-2.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                            >
                              Inspect Payload
                            </button>
                            {log.status === "FAILED" && (
                              <button
                                onClick={() => handleRetryWebhook(log.id)}
                                className="h-7 px-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                              >
                                Retry Job
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ 9. STORE SETTINGS ============ */}
          {activeSection === "settings" && <StoreSettings />}

        </main>
      </div>

      {/* Modals */}
      {selectedFulfillOrder && (
        <FulfillmentModal
          order={selectedFulfillOrder}
          onClose={() => setSelectedFulfillOrder(null)}
          onFulfillSuccess={handleFulfillSuccess}
        />
      )}
      {selectedTrackOrder && (
        <TrackingModal
          order={selectedTrackOrder}
          onClose={() => setSelectedTrackOrder(null)}
        />
      )}
      {selectedWebhookLog && (
        <PayloadModal
          log={selectedWebhookLog}
          onClose={() => setSelectedWebhookLog(null)}
        />
      )}
    </div>
  );
}
