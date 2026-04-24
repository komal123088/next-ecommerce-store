"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";

const STATUS_VARIANT: Record<string, any> = {
  pending: "warning",
  processing: "info",
  shipped: "purple",
  delivered: "success",
  cancelled: "danger",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Order History
      </h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No orders yet. Start shopping!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[order.status]}>
                    {order.status}
                  </Badge>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {order.items.length} item(s) ·{" "}
                {order.items
                  .map((i) => i.name)
                  .join(", ")
                  .slice(0, 60)}
                {order.items.map((i) => i.name).join(", ").length > 60
                  ? "..."
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
