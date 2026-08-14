import { prisma } from "../../lib/prisma";

export class AdminService {
  public async getDashboardAnalytics() {
    const totalOrders = await prisma.order.count();
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { total: true },
      where: { financialStatus: "PAID" },
    });
    const totalRevenue = totalRevenueResult._sum.total || 0;

    const totalCustomers = await prisma.customer.count();
    const repeatCustomers = await prisma.customer.count({
      where: { ordersCount: { gt: 1 } },
    });

    const activeShipments = await prisma.shipment.count({
      where: { status: { in: ["PROCESSING", "PICKUP_SCHEDULED", "IN_TRANSIT", "OUT_FOR_DELIVERY"] } },
    });

    const alerts = await prisma.adminAlert.findMany({
      where: { resolved: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Geographic Sales Breakdown by State
    const stateBreakdown = await prisma.order.groupBy({
      by: ["shippingState"],
      _count: { id: true },
      _sum: { total: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    return {
      overview: {
        totalOrders,
        totalRevenue: Number(totalRevenue),
        totalCustomers,
        newVsReturning: {
          new: totalCustomers - repeatCustomers,
          returning: repeatCustomers,
        },
        activeShipments,
      },
      stateBreakdown: stateBreakdown.map((s: any) => ({
        state: s.shippingState,
        orders: s._count.id,
        revenue: Number(s._sum.total || 0),
      })),
      unresolvedAlerts: alerts,
    };
  }

  public async getSyncHealth() {
    const failedProducts = await prisma.product.findMany({
      where: { syncStatus: "FAILED" },
      select: { id: true, title: true, syncError: true, lastSyncedAt: true },
    });

    const failedOrders = await prisma.order.findMany({
      where: { syncStatus: "FAILED" },
      select: { id: true, orderNumber: true, syncError: true, lastSyncedAt: true },
    });

    const webhookLogs = await prisma.webhookLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return {
      failedProducts,
      failedOrders,
      recentWebhookLogs: webhookLogs,
    };
  }

  public async createProduct(data: {
    title: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    category?: string;
    images?: string[];
    colors?: Array<{ name: string; hex: string }>;
    details?: string[];
    careInstructions?: string;
    fabricGsm?: string;
    fitProfile?: string;
    hsnCode?: string;
    variants?: Array<{ sku: string; title: string; color: string; size: string; price: number; inventoryQuantity: number }>;
  }) {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        category: data.category,
        images: data.images || [],
        colors: data.colors,
        details: data.details || [],
        careInstructions: data.careInstructions,
        fabricGsm: data.fabricGsm,
        fitProfile: data.fitProfile,
        hsnCode: data.hsnCode,
        variants: {
          create: data.variants || [],
        },
      } as any,
      include: {
        variants: true,
      },
    });

    return product;
  }

  public async getProducts() {
    return await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });
  }

  public async deleteProduct(id: string) {
    return await prisma.product.delete({
      where: { id },
    });
  }

  // Category & Featured Category Management
  private categoriesStore: Array<{
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    image: string;
    isFeatured: boolean;
    highlightTag?: string;
    sortOrder?: number;
  }> = [
    {
      id: "cat_1",
      name: "CASUAL SHIRTS",
      slug: "casual-shirts",
      subtitle: "100% VISCOSE & LINEN",
      image: "/images/shirt_viscose.png",
      isFeatured: true,
      highlightTag: "SUMMER 26",
      sortOrder: 1
    },
    {
      id: "cat_2",
      name: "HEAVYWEIGHT HOODIES",
      slug: "hoodies",
      subtitle: "450GSM FRENCH TERRY",
      image: "/images/product_distortion.png",
      isFeatured: true,
      highlightTag: "DROP 03",
      sortOrder: 2
    },
    {
      id: "cat_3",
      name: "OVERSIZED TEES",
      slug: "oversized-tees",
      subtitle: "DROP SHOULDER TAILORING",
      image: "/images/hero.png",
      isFeatured: true,
      highlightTag: "HOT DROP",
      sortOrder: 3
    },
    {
      id: "cat_4",
      name: "UTILITY CARGOS",
      slug: "cargo-pants",
      subtitle: "REINFORCED TWILL & CHINOS",
      image: "/images/chinos_cream.png",
      isFeatured: true,
      highlightTag: "ESSENTIAL",
      sortOrder: 4
    },
    {
      id: "cat_5",
      name: "KNITTED POLOS",
      slug: "polos",
      subtitle: "RETRO CLUB EMBROIDERED",
      image: "/images/polo_knit.png",
      isFeatured: true,
      highlightTag: "ATELIER EXCLUSIVE",
      sortOrder: 5
    },
    {
      id: "cat_6",
      name: "OUTERWEAR",
      slug: "outerwear",
      subtitle: "DENIM & TACTICAL JACKETS",
      image: "/images/editorial.png",
      isFeatured: true,
      highlightTag: "LIMITED",
      sortOrder: 6
    }
  ];

  public async getCategories() {
    return this.categoriesStore;
  }

  public async saveCategory(categoryData: any) {
    const existingIndex = this.categoriesStore.findIndex(
      (c) => c.id === categoryData.id || c.slug === categoryData.slug
    );

    const formatted = {
      id: categoryData.id || `cat_${Date.now()}`,
      name: categoryData.name.toUpperCase(),
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      subtitle: categoryData.subtitle || "ATELIER COLLECTION",
      image: categoryData.image || "/images/shirt_viscose.png",
      isFeatured: Boolean(categoryData.isFeatured),
      highlightTag: categoryData.highlightTag || undefined,
      sortOrder: categoryData.sortOrder || this.categoriesStore.length + 1
    };

    if (existingIndex >= 0) {
      this.categoriesStore[existingIndex] = { ...this.categoriesStore[existingIndex], ...formatted };
    } else {
      this.categoriesStore.push(formatted);
    }

    return formatted;
  }

  public async toggleFeaturedCategory(id: string) {
    const target = this.categoriesStore.find((c) => c.id === id || c.slug === id);
    if (!target) {
      throw new Error(`Category with ID ${id} not found`);
    }
    target.isFeatured = !target.isFeatured;
    return target;
  }

  public async deleteCategory(id: string) {
    this.categoriesStore = this.categoriesStore.filter((c) => c.id !== id && c.slug !== id);
    return { success: true, id };
  }
}

export const adminService = new AdminService();