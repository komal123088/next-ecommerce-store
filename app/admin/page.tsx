"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { CategoryPieChart } from "@/components/admin/CategoryPieChart";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const STATUS_VARIANT: Record<string, any> = {
    pending: "warning",
    processing: "info",
    shipped: "purple",
    delivered: "success",
    cancelled: "danger",
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" subtitle="Welcome back, Admin" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          ) : (
            <>
              <StatsCard
                title="Total Revenue"
                value={formatPrice(data.stats.totalRevenue)}
                icon={DollarSign}
                color="blue"
                change="+12.5%"
                positive
              />
              <StatsCard
                title="Total Orders"
                value={data.stats.totalOrders.toLocaleString()}
                icon={ShoppingBag}
                color="green"
                change="+8.2%"
                positive
              />
              <StatsCard
                title="Total Products"
                value={data.stats.totalProducts.toLocaleString()}
                icon={Package}
                color="purple"
              />
              <StatsCard
                title="Total Users"
                value={data.stats.totalUsers.toLocaleString()}
                icon={Users}
                color="orange"
                change="+3.1%"
                positive
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-white font-semibold mb-4">
              Revenue Overview (30 Days)
            </h2>
            {loading ? (
              <Skeleton className="h-64" />
            ) : (
              <RevenueChart data={data.revenueByDay} />
            )}
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-white font-semibold mb-4">
              Top Products Revenue
            </h2>
            {loading ? (
              <Skeleton className="h-64" />
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((p: any, i: number) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {p._id}
                      </p>
                      <p className="text-slate-400 text-xs">{p.sold} sold</p>
                    </div>
                    <span className="text-blue-400 text-sm font-semibold">
                      {formatPrice(p.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-white font-semibold mb-4">Recent Orders</h2>
            {loading ? (
              <Skeleton className="h-48" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      {["Order", "Customer", "Total", "Status"].map((h) => (
                        <th
                          key={h}
                          className="text-left pb-2 text-slate-400 font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {data.recentOrders.map((order: any) => (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="py-2.5 text-slate-300">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-2.5 text-slate-300">
                          {typeof order.user === "object"
                            ? order.user.name
                            : "—"}
                        </td>
                        <td className="py-2.5 text-white font-medium">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-2.5">
                          <Badge variant={STATUS_VARIANT[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h2 className="text-white font-semibold">Low Stock Alerts</h2>
            </div>
            {loading ? (
              <Skeleton className="h-48" />
            ) : (
              <div className="space-y-3">
                {data.lowStock.length === 0 ? (
                  <p className="text-slate-400 text-sm">
                    All products are well stocked!
                  </p>
                ) : (
                  data.lowStock.map((p: any) => (
                    <div key={p._id} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {p.name}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {p.stock} units left
                        </p>
                      </div>
                      <Badge variant={p.stock === 0 ? "danger" : "warning"}>
                        {p.stock === 0 ? "Out" : "Low"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
