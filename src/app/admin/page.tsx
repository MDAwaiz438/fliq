import { Package, TrendingUp, Users, DollarSign } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const productsCount = await prisma.product.count();
  const ordersCount = await prisma.order.count();
  
  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: 'Cancelled' } }
  });

  // Count unique customers
  const uniqueCustomers = await prisma.order.groupBy({
    by: ['customer'],
  });

  const stats = [
    { title: "Total Revenue", value: `₹${(totalRevenue._sum.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: "+20.1%", icon: DollarSign },
    { title: "Orders", value: ordersCount.toString(), trend: "+15%", icon: TrendingUp },
    { title: "Active Products", value: productsCount.toString(), trend: "0%", icon: Package },
    { title: "Customers", value: uniqueCustomers.length.toString(), trend: "+2%", icon: Users },
  ];

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-(--accent) text-(--bg) p-6 border-2 border-(--bg) shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-(--bg)">{stat.title}</h3>
              <stat.icon size={20} className="text-(--bg)" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{stat.value}</span>
              <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-(--bg)' : 'text-(--bg)'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-(--accent) text-(--bg) border-2 border-(--bg) shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-2 border-(--bg) flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tighter">Recent Orders</h2>
          <button className="text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="p-6">
          <table className="w-full text-left text-sm font-medium">
            <thead>
              <tr className="text-xs font-black uppercase tracking-widest text-(--bg) border-b-2 border-(--bg)">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order, i) => (
                <tr key={i} className="border-b border-(--accent) last:border-0">
                  <td className="py-4 font-bold">#{order.id.slice(0,8).toUpperCase()}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase ${order.status === 'Processing' ? 'bg-(--bg) text-(--accent)' : 'bg-(--bg) text-(--accent)'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-black">₹{order.total.toFixed(2)}</td>
                </tr>
              ))}
              {allOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center font-bold text-(--bg)">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
