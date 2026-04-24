"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { IOrder } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const STATUS_VARIANT: Record<string, any> = {
  pending: "warning",
  processing: "info",
  shipped: "purple",
  delivered: "success",
  cancelled: "danger",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    const url = statusFilter
      ? `/api/orders?status=${statusFilter}&limit=100`
      : "/api/orders?limit=100";
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingStatus(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    toast.success("Order status updated");
    setUpdatingStatus(false);
    load();
    if (selectedOrder?._id === orderId)
      setSelectedOrder({ ...selectedOrder, status: status as any });
  };

  const exportCSV = () => {
    const csv = [
      "Order ID,Customer,Total,Status,Date",
      ...orders.map((o) =>
        [
          o._id,
          typeof o.user === "object" ? o.user.name : "Unknown",
          o.total.toFixed(2),
          o.status,
          formatDate(o.createdAt),
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Orders" subtitle="Manage all customer orders" />

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={exportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <span className="text-slate-400 text-sm ml-auto">
            {orders.length} orders
          </span>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="table-header text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-slate-300 text-xs">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-white">
                          {typeof order.user === "object"
                            ? order.user.name
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {order.items.length}
                        </td>
                        <td className="px-4 py-3 text-white font-semibold">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_VARIANT[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-400 hover:text-blue-300 text-xs font-medium hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?._id.slice(-8).toUpperCase()}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Customer
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {typeof selectedOrder.user === "object"
                    ? selectedOrder.user.name
                    : "—"}
                </p>
                <p className="text-sm text-gray-500">
                  {typeof selectedOrder.user === "object"
                    ? selectedOrder.user.email
                    : ""}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Shipping Address
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedOrder.shippingAddress?.street}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state}{" "}
                  {selectedOrder.shippingAddress?.zip}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Items
              </p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">×{item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Update Status:
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusUpdate(selectedOrder._id, e.target.value)
                }
                disabled={updatingStatus}
                className="input py-2 text-sm flex-1"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                {formatPrice(selectedOrder.total)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
