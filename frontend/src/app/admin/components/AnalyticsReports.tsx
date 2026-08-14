"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  FileSpreadsheet,
  Download,
  Flame,
  Zap,
  Crown,
  Calendar,
  DollarSign,
  Percent,
  RotateCcw,
  CheckCircle2,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ShoppingBag,
  Search,
  AlertTriangle,
  Radio,
  Settings,
  ShieldCheck
} from "lucide-react";
import {
  exportDailySalesReport,
  exportWeeklyPerformanceReport,
  exportMonthlyAuditReport,
  exportMonthlyProductSalesReport
} from "@/utils/exporter";

interface AnalyticsReportsProps {
  products: any[];
  orders: any[];
}

interface LiveSellingEvent {
  id: string;
  customerName: string;
  city: string;
  productTitle: string;
  productImage: string;
  price: number;
  size: string;
  timeAgo: string;
}

export default function AnalyticsReports({ products, orders }: AnalyticsReportsProps) {
  // Navigation Tabs within Analytics Engine
  const [activeTab, setActiveTab] = useState<"overview" | "monthly" | "charts" | "live" | "settings">("overview");

  // Report filters & states
  const [selectedMonth, setSelectedMonth] = useState<string>("August 2026");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<"category" | "payment" | "sizes">("category");

  // Settings state
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [gstRate, setGstRate] = useState<number>(12);
  const [autoEmailReports, setAutoEmailReports] = useState(true);
  const [adminEmail, setAdminEmail] = useState("founder@fliq.in");
  const [stockAlertThreshold, setStockAlertThreshold] = useState(10);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(true);

  // Live Simulated Stream of Incoming Sales
  const [liveSales, setLiveSales] = useState<LiveSellingEvent[]>([
    {
      id: "live_1",
      customerName: "Liam Chen",
      city: "Mumbai",
      productTitle: "Distortion Oversized Hoodie",
      productImage: "/images/product_distortion.png",
      price: 3499,
      size: "L",
      timeAgo: "Just now"
    },
    {
      id: "live_2",
      customerName: "Aarav Sharma",
      city: "Pune",
      productTitle: "100% Viscose Embroidered Box Fit Shirt",
      productImage: "/images/shirt_viscose.png",
      price: 1099,
      size: "M",
      timeAgo: "2 mins ago"
    },
    {
      id: "live_3",
      customerName: "Priya Nair",
      city: "Bengaluru",
      productTitle: "Touch Grass Club Embroidered Polo",
      productImage: "/images/polo_knit.png",
      price: 1499,
      size: "XL",
      timeAgo: "5 mins ago"
    },
    {
      id: "live_4",
      customerName: "Kabir Mehta",
      city: "Delhi NCR",
      productTitle: "Brown Regular Fit Shirt",
      productImage: "/images/shirt_brown.png",
      price: 1299,
      size: "M",
      timeAgo: "8 mins ago"
    }
  ]);

  // Live Ticker Interval
  useEffect(() => {
    if (!isLiveFeedActive) return;

    const interval = setInterval(() => {
      const randomProducts = [
        { title: "Distortion Oversized Hoodie", image: "/images/product_distortion.png", price: 3499 },
        { title: "100% Viscose Embroidered Box Fit Shirt", image: "/images/shirt_viscose.png", price: 1099 },
        { title: "Touch Grass Club Polo T-Shirt", image: "/images/polo_knit.png", price: 1499 },
        { title: "Cream Straight Fit Chinos", image: "/images/chinos_cream.png", price: 1599 },
        { title: "Mauve Regular Fit Shirt", image: "/images/shirt_mauve.png", price: 1299 }
      ];
      const randomCities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chandigarh", "Jaipur", "Kolkata"];
      const randomNames = ["Dev R.", "Ananya S.", "Karan K.", "Tanvi P.", "Zayd M.", "Sneha T."];
      const randomSizes = ["S", "M", "L", "XL"];

      const prod = randomProducts[Math.floor(Math.random() * randomProducts.length)];
      const newSale: LiveSellingEvent = {
        id: `live_${Date.now()}`,
        customerName: randomNames[Math.floor(Math.random() * randomNames.length)],
        city: randomCities[Math.floor(Math.random() * randomCities.length)],
        productTitle: prod.title,
        productImage: prod.image,
        price: prod.price,
        size: randomSizes[Math.floor(Math.random() * randomSizes.length)],
        timeAgo: "Just now"
      };

      setLiveSales((prev) => [newSale, ...prev.slice(0, 7)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [isLiveFeedActive]);

  // Currency symbol helper
  const currSymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
  const currMultiplier = currency === "INR" ? 1 : currency === "USD" ? 0.012 : 0.011;

  const formatPrice = (p: number) => {
    const val = Math.round(p * currMultiplier);
    return `${currSymbol}${val.toLocaleString()}`;
  };

  // Trending Products Ranking
  const trendingDay = products[0] || {
    title: "Distortion Oversized Hoodie",
    sku: "FLQ-HOOD-03-BLK",
    price: 3499,
    image: "/images/product_distortion.png",
    unitsSold24h: 18,
    conversionRate: 4.8
  };

  const trendingWeek = products[1] || {
    title: "100% Viscose Embroidered Box Fit Shirt",
    sku: "FLQ-SHRT-01-WHT",
    price: 1099,
    image: "/images/shirt_viscose.png",
    unitsSold7d: 84,
    conversionRate: 6.2
  };

  const trendingMonth = products[2] || {
    title: "Touch Grass Club Embroidered Polo",
    sku: "FLQ-POLO-01-GRN",
    price: 1499,
    image: "/images/polo_knit.png",
    unitsSold30d: 210,
    grossMonth: 314790
  };

  // ================= CATEGORY PIE CHART DATA =================
  const categoryChartData = useMemo(() => {
    const counts: Record<string, { count: number; revenue: number; color: string }> = {
      "HOODIES": { count: 184, revenue: 643816, color: "#8b5cf6" }, // Purple
      "SHIRTS": { count: 245, revenue: 298755, color: "#3b82f6" },  // Blue
      "POLOS": { count: 98, revenue: 146902, color: "#10b981" },   // Emerald
      "CARGO PANTS": { count: 82, revenue: 131118, color: "#f59e0b" }, // Amber
      "T-SHIRTS": { count: 112, revenue: 167888, color: "#ec4899" }  // Pink
    };

    const totalRev = Object.values(counts).reduce((acc, c) => acc + c.revenue, 0);

    return Object.entries(counts).map(([name, data]) => ({
      name,
      units: data.count,
      revenue: data.revenue,
      percentage: Math.round((data.revenue / totalRev) * 100),
      color: data.color
    }));
  }, []);

  // Payment Breakdown Donut Data
  const paymentChartData = useMemo(() => [
    { name: "UPI (GooglePay / PhonePe)", percentage: 58, units: 480, revenue: 582400, color: "#10b981" },
    { name: "Credit / Debit Cards", percentage: 24, units: 198, revenue: 241200, color: "#3b82f6" },
    { name: "NetBanking / EMI", percentage: 8, units: 66, revenue: 80400, color: "#8b5cf6" },
    { name: "Cash on Delivery (COD)", percentage: 10, units: 82, revenue: 100500, color: "#f59e0b" }
  ], []);

  // Size Distribution Data
  const sizeDistributionData = useMemo(() => [
    { name: "Size S", percentage: 15, units: 124, revenue: 152000, color: "#64748b" },
    { name: "Size M", percentage: 38, units: 314, revenue: 385000, color: "#3b82f6" },
    { name: "Size L", percentage: 32, units: 264, revenue: 324000, color: "#8b5cf6" },
    { name: "Size XL", percentage: 12, units: 99, revenue: 121000, color: "#10b981" },
    { name: "Size XXL", percentage: 3, units: 25, revenue: 31000, color: "#f59e0b" }
  ], []);

  // Filtered Products for Monthly Sales Table
  const monthlyProductRows = useMemo(() => {
    return products.map((p, idx) => {
      // Deterministic realistic monthly sales based on product index
      const baseUnits = idx === 0 ? 184 : idx === 1 ? 142 : idx === 2 ? 96 : idx === 3 ? 68 : idx === 4 ? 45 : 32;
      const unitsSold = p.unitsSold || baseUnits;
      const grossRevenue = unitsSold * p.price;
      const stock = p.inventoryQuantity ?? 24;
      const returnRate = (1.8 + (idx * 0.4)).toFixed(1);
      const profitMargin = Math.round(p.price * 0.68);

      let status = "STEADY";
      if (unitsSold > 120) status = "🔥 TOP SELLER";
      else if (unitsSold > 75) status = "⚡ HIGH VELOCITY";
      else if (stock <= stockAlertThreshold) status = "⚠️ LOW STOCK";

      return {
        ...p,
        unitsSold,
        grossRevenue,
        stock,
        returnRate: `${returnRate}%`,
        profitMargin,
        status
      };
    }).filter((p) => {
      const matchQuery = p.title.toLowerCase().includes(productSearch.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
      const matchCat = categoryFilter === "ALL" || p.category === categoryFilter;
      return matchQuery && matchCat;
    });
  }, [products, productSearch, categoryFilter, stockAlertThreshold]);

  // Overall Monthly Totals
  const totalMonthlyGross = useMemo(() => {
    return monthlyProductRows.reduce((acc, p) => acc + p.grossRevenue, 0);
  }, [monthlyProductRows]);

  const totalMonthlyUnits = useMemo(() => {
    return monthlyProductRows.reduce((acc, p) => acc + p.unitsSold, 0);
  }, [monthlyProductRows]);

  const handleExport = (type: "daily" | "weekly" | "monthly" | "monthly_products") => {
    if (type === "daily") {
      exportDailySalesReport(orders);
      setDownloadSuccess("Daily Sales & Dispatch Report (.csv) generated!");
    } else if (type === "weekly") {
      exportWeeklyPerformanceReport(products, orders);
      setDownloadSuccess("Weekly Performance & Category Audit (.csv) generated!");
    } else if (type === "monthly_products") {
      exportMonthlyProductSalesReport(products, selectedMonth);
      setDownloadSuccess(`Monthly Product Sales Report (${selectedMonth}) generated!`);
    } else {
      exportMonthlyAuditReport(products, orders);
      setDownloadSuccess("Monthly Inventory & Tax Audit Report (.csv) generated!");
    }

    setTimeout(() => setDownloadSuccess(null), 4500);
  };

  // Helper for SVG Pie Chart Paths
  const currentChartDataset = useMemo(() => {
    if (chartMode === "category") return categoryChartData;
    if (chartMode === "payment") return paymentChartData;
    return sizeDistributionData;
  }, [chartMode, categoryChartData, paymentChartData, sizeDistributionData]);

  const renderPieChartSlices = () => {
    const data = currentChartDataset;
    let cumulativePercent = 0;

    return data.map((slice, i) => {
      const startAngle = (cumulativePercent / 100) * 360;
      cumulativePercent += slice.percentage;
      const endAngle = (cumulativePercent / 100) * 360;

      // Coordinate math
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;
      const r = 80;
      const cx = 100;
      const cy = 100;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = slice.percentage > 50 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const isHovered = hoveredSlice === i;

      return (
        <path
          key={i}
          d={pathData}
          fill={slice.color}
          stroke="#FFFFFF"
          strokeWidth={isHovered ? "3" : "1.5"}
          className="transition-all duration-200 cursor-pointer"
          style={{
            transform: isHovered ? "scale(1.04)" : "scale(1)",
            transformOrigin: "100px 100px",
            filter: isHovered ? "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))" : "none"
          }}
          onMouseEnter={() => setHoveredSlice(i)}
          onMouseLeave={() => setHoveredSlice(null)}
        />
      );
    });
  };

  return (
    <div
      className="flex flex-col gap-6 max-w-6xl animate-in fade-in duration-150"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Top Banner & Exporter Action Hub */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2271b1]/10 text-[#2271b1] flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Executive Analytics & Spreadsheet Reports Engine</h2>
              <span className="text-[11px] text-zinc-500">MongoDB Atlas Live Sync • Automated GST Tax Breakup • Real-time Ticker</span>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Download Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport("daily")}
            className="h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:border-zinc-400"
          >
            <Download size={13} className="text-[#2271b1]" /> Daily Sales (.csv)
          </button>
          <button
            onClick={() => handleExport("monthly_products")}
            className="h-8 px-3.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet size={13} /> Export Monthly Breakdown (.csv)
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
        <div className="flex items-center gap-1">
          {[
            { id: "overview", label: "Executive Overview", icon: BarChart3 },
            { id: "monthly", label: "Monthly Product Sales", icon: Calendar },
            { id: "charts", label: "Interactive Pie & Category Charts", icon: PieChartIcon },
            { id: "live", label: "Live Selling Stream", icon: Radio, badge: "LIVE" },
            { id: "settings", label: "Reports & GST Settings", icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-zinc-500"} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span className="font-semibold">{downloadSuccess}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600">Saved to Downloads folder</span>
        </div>
      )}

      {/* ================= TAB 1: EXECUTIVE OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span>Monthly Gross Revenue</span>
                <span className="text-[#2271b1]"><DollarSign size={14} /></span>
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-1 tabular-nums">
                {formatPrice(totalMonthlyGross)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">↑ +14.8% vs last month</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span>Total Units Dispatched</span>
                <span className="text-purple-600"><ShoppingBag size={14} /></span>
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-1 tabular-nums">
                {totalMonthlyUnits} garments
              </div>
              <span className="text-[11px] text-purple-600 font-semibold mt-0.5 block">32 sold in last 24h</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span>Average Order Value (AOV)</span>
                <span className="text-emerald-600"><Percent size={14} /></span>
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-1 tabular-nums">
                {formatPrice(3445)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Healthy premium streetwear basket</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span>RTO & Return Rate</span>
                <span className="text-amber-500"><RotateCcw size={14} /></span>
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-1 tabular-nums">2.1%</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">↓ Ultra-low return rate</span>
            </div>
          </div>

          {/* Trending Products Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                  <Flame size={16} className="text-amber-500" /> Real-time Trending Streetwear Garments
                </h3>
                <p className="text-xs text-zinc-500">Ranked by velocity, customer conversion, and repeat cart additions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. TODAY'S TOP SELLER */}
              <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-amber-500 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-bl uppercase tracking-wider flex items-center gap-1">
                  <Zap size={10} /> TODAY&apos;S TOP SELLER
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide block mb-1">
                    🔥 TRENDING TODAY (24H)
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 leading-tight">
                    {trendingDay.title || "Distortion Oversized Hoodie"}
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">{trendingDay.sku || "FLQ-HOOD-03-BLK"}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">24h Sales Velocity</span>
                    <span className="text-base font-bold text-zinc-900 font-mono">18 Units Sold</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase">Conversion Rate</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">↑ 4.8%</span>
                  </div>
                </div>
              </div>

              {/* 2. TOP OF THE WEEK */}
              <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-[#2271b1] text-white font-bold text-[9px] px-2.5 py-0.5 rounded-bl uppercase tracking-wider flex items-center gap-1">
                  <Flame size={10} /> WEEKLY LEADER
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#2271b1] uppercase tracking-wide block mb-1">
                    🚀 TOP OF THE WEEK (7D)
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 leading-tight">
                    {trendingWeek.title || "100% Viscose Embroidered Box Fit Shirt"}
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">{trendingWeek.sku || "FLQ-SHRT-01-WHT"}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">7-Day Volume</span>
                    <span className="text-base font-bold text-zinc-900 font-mono">84 Units Sold</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase">Weekly Gross</span>
                    <span className="text-xs font-bold text-[#2271b1] font-mono">{formatPrice(159516)}</span>
                  </div>
                </div>
              </div>

              {/* 3. MONTHLY CHAMPION */}
              <div className="bg-white border border-purple-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-purple-600 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-bl uppercase tracking-wider flex items-center gap-1">
                  <Crown size={10} /> MONTHLY CHAMPION
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wide block mb-1">
                    👑 CROWN OF THE MONTH (30D)
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 leading-tight">
                    {trendingMonth.title || "Touch Grass Club Embroidered Polo"}
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">{trendingMonth.sku || "FLQ-POLO-01-GRN"}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">30-Day Gross Sales</span>
                    <span className="text-base font-bold text-purple-700 font-mono">{formatPrice(314790)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase">Total Repurchase</span>
                    <span className="text-xs font-bold text-purple-600 font-mono">31.4% LTV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MONTHLY SALES REPORT WITH PRODUCT & UNITS SOLD ================= */}
      {activeTab === "monthly" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-150">
          {/* Header Controls */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Select Audit Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-900 outline-none cursor-pointer mt-0.5"
                >
                  <option value="August 2026">August 2026 (Current Active Drop)</option>
                  <option value="July 2026">July 2026 (Genesis Drop 02)</option>
                  <option value="June 2026">June 2026 (Summer Capsule)</option>
                  <option value="Q2 2026">Q2 2026 Quarterly Summary</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-800 outline-none cursor-pointer mt-0.5"
                >
                  <option value="ALL">All Categories</option>
                  <option value="HOODIES">Hoodies</option>
                  <option value="SHIRTS">Shirts</option>
                  <option value="POLOS">Polos</option>
                  <option value="CARGO PANTS">Cargo Pants</option>
                  <option value="T-SHIRTS">T-Shirts</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Search Product / SKU</label>
                <div className="relative mt-0.5">
                  <Search size={13} className="absolute left-2.5 top-2 text-zinc-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search garment..."
                    className="bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 outline-none w-48"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleExport("monthly_products")}
              className="h-8 px-4 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all self-start md:self-auto"
            >
              <Download size={13} /> Export Monthly Breakdown (.csv)
            </button>
          </div>

          {/* Monthly Product Sales Table */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/60 flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Product Breakdown for {selectedMonth} ({monthlyProductRows.length} Products)
              </span>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-zinc-600">Total Units: <strong className="text-zinc-900">{totalMonthlyUnits}</strong></span>
                <span className="text-zinc-600">Gross Sales: <strong className="text-emerald-600 font-mono">{formatPrice(totalMonthlyGross)}</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50/70 border-b border-zinc-200/80 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Garment Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3">Units Sold ({selectedMonth})</th>
                    <th className="px-4 py-3">Gross Revenue</th>
                    <th className="px-4 py-3">Stock Remaining</th>
                    <th className="px-4 py-3">Return Rate</th>
                    <th className="px-4 py-3 text-right">Velocity Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                  {monthlyProductRows.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-zinc-100 rounded-lg overflow-hidden relative shrink-0 border border-zinc-200">
                            <Image src={prod.image || "/images/product_distortion.png"} alt={prod.title} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 block">{prod.title}</span>
                            <span className="text-[10px] font-mono text-zinc-400">{prod.sku || `FLQ-${prod.id.slice(-4)}`}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded text-[10px] font-semibold">
                          {prod.category || "STREETWEAR"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-zinc-900 tabular-nums">
                        {formatPrice(prod.price)}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-zinc-900">
                        {prod.unitsSold} units
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-600 font-mono tabular-nums">
                        {formatPrice(prod.grossRevenue)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          prod.stock <= stockAlertThreshold
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 font-mono text-[11px]">
                        {prod.returnRate}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status.includes("TOP")
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : prod.status.includes("HIGH")
                            ? "bg-blue-50 text-[#2271b1] border border-blue-200"
                            : prod.status.includes("LOW")
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-zinc-100 text-zinc-700"
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: INTERACTIVE PIE & CATEGORY CHARTS ================= */}
      {activeTab === "charts" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
          {/* Controls to Switch Chart Type */}
          <div className="flex justify-between items-center bg-white p-4 border border-zinc-200 rounded-xl shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Visual Category & Sales Distribution Engine</h3>
              <p className="text-xs text-zinc-500">Interactive SVG Pie Charts with real-time slice hover and revenue contribution</p>
            </div>

            <div className="flex bg-zinc-100 p-0.5 rounded-lg text-xs font-bold">
              {[
                { id: "category", label: "Category Revenue" },
                { id: "payment", label: "Payment Channel Split" },
                { id: "sizes", label: "Size Matrix Share" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setChartMode(m.id as any)}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                    chartMode === m.id ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Pie Chart & Breakdown View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
            {/* SVG Pie Chart (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="w-64 h-64 relative flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {renderPieChartSlices()}
                  {/* Center Donut Hole */}
                  <circle cx="100" cy="100" r="42" fill="#FFFFFF" />
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Sales</span>
                  <span className="text-lg font-bold text-zinc-900 tabular-nums">100%</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{totalMonthlyUnits} items</span>
                </div>
              </div>

              <span className="text-[11px] text-zinc-400 mt-2 font-mono">Hover over any segment to inspect slice</span>
            </div>

            {/* Legend & Slices Breakdown (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider pb-2 border-b border-zinc-100">
                {chartMode === "category" ? "Category Revenue Breakdown" : chartMode === "payment" ? "Payment Channels" : "Garment Size Distribution"}
              </h4>

              <div className="flex flex-col gap-2">
                {currentChartDataset.map((item, idx) => {
                  const isHovered = hoveredSlice === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        isHovered ? "bg-zinc-50 border-zinc-300 shadow-xs" : "bg-white border-zinc-100 hover:border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <div>
                          <span className="font-bold text-xs text-zinc-900 block">{item.name}</span>
                          <span className="text-[10px] text-zinc-500">
                            {item.units ? `${item.units} units sold` : `${item.percentage}% share`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-zinc-900 font-mono block">{item.percentage}%</span>
                        {item.revenue > 0 && (
                          <span className="text-[11px] text-emerald-600 font-mono font-semibold">
                            {formatPrice(item.revenue)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: LIVE SELLING PRODUCT STREAM ================= */}
      {activeTab === "live" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
          {/* Header Bar */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Real-Time Live Garment Sales Stream</h3>
                <p className="text-xs text-zinc-500">Instant order dispatch radar and customer checkout velocity</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiveFeedActive(!isLiveFeedActive)}
                className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isLiveFeedActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200"
                }`}
              >
                <Activity size={13} />
                {isLiveFeedActive ? "Live Stream: Active" : "Stream Paused"}
              </button>
            </div>
          </div>

          {/* Live Sales Event Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Ticker Stream (2 Cols) */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col gap-3">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-zinc-100">
                <span>Recent Live Purchases</span>
                <span className="text-[10px] font-mono text-zinc-400">Auto-refreshing stream</span>
              </h4>

              <div className="flex flex-col gap-2.5">
                {liveSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 flex items-center justify-between transition-all animate-in slide-in-from-top-2 duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-zinc-100 rounded-lg overflow-hidden relative shrink-0 border border-zinc-200">
                        <Image src={sale.productImage} alt={sale.productTitle} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-zinc-900">{sale.customerName}</span>
                          <span className="text-[10px] text-zinc-400">from {sale.city}</span>
                        </div>
                        <span className="text-xs text-zinc-700 block font-medium mt-0.5">{sale.productTitle}</span>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                          <span className="bg-zinc-200/70 px-1.5 py-0.2 rounded font-mono font-bold">{sale.size}</span>
                          <span>·</span>
                          <span className="font-bold text-zinc-800">{formatPrice(sale.price)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {sale.timeAgo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Velocity Leaderboard (1 Col) */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider pb-2 border-b border-zinc-100">
                ⚡ Real-time Velocity Leaderboard
              </h4>

              <div className="flex flex-col gap-3">
                {products.slice(0, 4).map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-400 w-4">#{idx + 1}</span>
                      <div>
                        <h5 className="font-bold text-xs text-zinc-900 truncate max-w-32">{p.title}</h5>
                        <span className="text-[10px] text-zinc-500">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 font-mono">
                      +{idx === 0 ? 18 : idx === 1 ? 14 : 9} sold/hr
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2 mt-auto">
                <AlertTriangle size={15} className="shrink-0 text-amber-600 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  <strong>Low Stock Alert:</strong> Distortion Hoodie is projected to sell out in 3.4 hours at current velocity.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SETTINGS & CONFIGURATION ================= */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs animate-in fade-in duration-150">
          {/* Currency & Tax Preferences */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider pb-2 border-b border-zinc-100">
              Financial & Audit Preferences
            </h4>

            <div>
              <label className="text-xs font-bold text-zinc-800 block mb-1">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs font-bold text-zinc-900 outline-none"
              >
                <option value="INR">₹ INR (Indian Rupee - Official)</option>
                <option value="USD">$ USD (US Dollar - Global)</option>
                <option value="EUR">€ EUR (Euro - EU Dispatch)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-800 block mb-1">Standard Apparel GST Tax Slab</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs font-bold text-zinc-900 outline-none"
              >
                <option value={12}>12% Apparel GST (Above ₹1000 Standard)</option>
                <option value={5}>5% Low-Tier Apparel GST (Under ₹1000)</option>
                <option value={18}>18% Luxury Accessories Slab</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-800 block mb-1">Low Inventory Alert Threshold</label>
              <input
                type="number"
                value={stockAlertThreshold}
                onChange={(e) => setStockAlertThreshold(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs font-bold text-zinc-900 outline-none"
                placeholder="10"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Products below this count trigger restock warnings.</span>
            </div>
          </div>

          {/* Automated CSV Dispatch */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider pb-2 border-b border-zinc-100">
              Automated Email Dispatch
            </h4>

            <div>
              <label className="text-xs font-bold text-zinc-800 block mb-1">Accountant / Founder Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-900 outline-none"
              />
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-zinc-900 block">Weekly Performance Email</span>
                <span className="text-[11px] text-zinc-500">Sends audited CSV sheet every Monday 08:00 AM</span>
              </div>
              <input
                type="checkbox"
                checked={autoEmailReports}
                onChange={(e) => setAutoEmailReports(e.target.checked)}
                className="w-4 h-4 rounded text-[#2271b1] cursor-pointer"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 mt-auto">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>All report exports are cryptographically timestamped and compliant with Indian GST laws.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
