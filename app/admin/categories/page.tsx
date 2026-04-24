"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ICategory } from "@/types";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Category created!");
      setModalOpen(false);
      setForm({ name: "", image: "" });
      load();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Categories" subtitle="Manage product categories" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-400 text-sm">
            {categories.length} categories
          </span>
          <Button
            onClick={() => setModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))
            : categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex items-center gap-4"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">{cat.name}</h3>
                    <p className="text-slate-400 text-sm">/{cat.slug}</p>
                    <p className="text-slate-500 text-xs">
                      {(cat as any).productCount || 0} products
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Category"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="e.g. Electronics"
            />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="input"
              placeholder="https://..."
            />
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
