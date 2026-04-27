"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IOrder } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const STATUS_VARIANT: Record<string, any> = {
  pending: "warning",
  processing: "info",
  shipped: "purple",
  delivered: "success",
  cancelled: "danger",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Login nahi hai tu login page pr bhejo
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account/orders");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => {
          setOrders(d.orders || []);
          setLoading(false);
        });
    }
  }, [status, router]);

  // ✅ Session load hone tak skeleton dikhao
  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5"
            >
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No orders yet. Start shopping!
          </p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
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
