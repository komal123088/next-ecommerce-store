"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { CategoryPieChart } from "@/components/admin/CategoryPieChart";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { formatPrice, formatDate } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export default function AdminAnalyticsPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="Analytics" />
        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const ordersBarData = data?.revenueByDay?.map((d: any) => ({
    ...d,
    label: format(parseISO(d.date), "MM/dd"),
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Analytics"
        subtitle="Insights & performance metrics"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-white font-semibold mb-4">
              Revenue Trend (30 Days)
            </h2>
            <RevenueChart data={data.revenueByDay} />
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-white font-semibold mb-4">Orders Per Day</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={ordersBarData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-white font-semibold mb-4">
              Top Products by Revenue
            </h2>
            <div className="space-y-3">
              {data.topProducts.map((p: any, i: number) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-6 text-right">
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm font-medium truncate">
                        {p._id}
                      </span>
                      <span className="text-blue-400 text-sm font-semibold ml-2">
                        {formatPrice(p.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{
                          width: `${(p.revenue / data.topProducts[0].revenue) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {p.sold} units sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-white font-semibold mb-4">
              Revenue by Category
            </h2>
            <CategoryPieChart
              data={data.topProducts.map((p: any) => ({
                name: p._id.slice(0, 15),
                value: Math.round(p.revenue),
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
