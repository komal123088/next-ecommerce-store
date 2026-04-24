"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ICoupon } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const emptyForm = {
  code: "",
  discountType: "percentage",
  amount: "",
  expiryDate: "",
  usageLimit: "100",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/coupons");
    const data = await res.json();
    setCoupons(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!form.code || !form.amount || !form.expiryDate) {
      toast.error("Fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          usageLimit: parseInt(form.usageLimit),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Coupon created!");
      setModalOpen(false);
      setForm({ ...emptyForm });
      load();
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/coupons`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    toast.success("Coupon deleted");
    load();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/coupons`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !current }),
    });
    load();
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Coupons" subtitle="Manage discount codes" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-400 text-sm">
            {coupons.length} coupons
          </span>
          <Button
            onClick={() => setModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Create Coupon
          </Button>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {[
                    "Code",
                    "Type",
                    "Amount",
                    "Expiry",
                    "Usage",
                    "Status",
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
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : coupons.map((coupon) => (
                      <tr
                        key={coupon._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-blue-400 font-semibold">
                          {coupon.code}
                        </td>
                        <td className="px-4 py-3 text-slate-300 capitalize">
                          {coupon.discountType}
                        </td>
                        <td className="px-4 py-3 text-white font-semibold">
                          {coupon.discountType === "percentage"
                            ? `${coupon.amount}%`
                            : `$${coupon.amount}`}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {formatDate(coupon.expiryDate)}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {coupon.usedCount}/{coupon.usageLimit}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={coupon.isActive ? "success" : "default"}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                toggleActive(coupon._id, coupon.isActive)
                              }
                              className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                            >
                              {coupon.isActive ? (
                                <ToggleRight className="w-4 h-4 text-blue-400" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(coupon._id)}
                              className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Coupon"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Coupon Code *</label>
            <input
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              className="input font-mono"
              placeholder="e.g. SUMMER20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({ ...form, discountType: e.target.value })
                }
                className="input"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="label">Amount *</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input"
                placeholder={form.discountType === "percentage" ? "20" : "15"}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Expiry Date *</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                className="input"
              />
            </div>
            <div>
              <label className="label">Usage Limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm({ ...form, usageLimit: e.target.value })
                }
                className="input"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
