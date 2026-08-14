"use client";

import { useRouter } from "next/navigation";
import ProductEditorView from "../../components/ProductEditorView";
import AdminSidebar from "../../components/AdminSidebar";
import AdminToolbar from "../../components/AdminToolbar";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSave = (newProduct: any) => {
    alert(`Garment "${newProduct.title}" published successfully to MongoDB!`);
    router.push("/admin");
  };

  return (
    <div
      className="min-h-screen bg-[#f0f0f1] text-zinc-900"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <AdminSidebar
        activeSection="products"
        onNavigate={(sec) => router.push("/admin")}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`transition-all duration-200 min-h-screen flex flex-col ${sidebarCollapsed ? "ml-16" : "ml-60"}`}>
        <AdminToolbar
          pageTitle="Add New Garment Drop"
          pageDescription="Full-Page Garment Specification, Multi-Angle Studio & MongoDB Schema"
        />

        <main className="flex-1 p-6">
          <ProductEditorView
            onBack={() => router.push("/admin")}
            onSave={handleSave}
          />
        </main>
      </div>
    </div>
  );
}
