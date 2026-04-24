"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { IProduct, ICategory } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  images: [""],
  featured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const load = async () => {
    const [prRes, catRes] = await Promise.all([
      fetch("/api/products?limit=100"),
      fetch("/api/categories"),
    ]);
    const [{ products: prods }, cats] = await Promise.all([
      prRes.json(),
      catRes.json(),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };
  const openEdit = (p: IProduct) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      category: typeof p.category === "object" ? p.category._id : p.category,
      images: p.images,
      featured: p.featured,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const url = editProduct
        ? `/api/products/${editProduct._id}`
        : "/api/products";
      const method = editProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(editProduct ? "Product updated!" : "Product created!");
      setModalOpen(false);
      load();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Product deleted");
    setDeleteConfirm(null);
    load();
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      selected.map((id) => fetch(`/api/products/${id}`, { method: "DELETE" })),
    );
    toast.success(`${selected.length} products deleted`);
    setSelected([]);
    load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Products"
        subtitle={`${products.length} total products`}
      />

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          {selected.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete ({selected.length})
            </Button>
          )}
          <Button
            onClick={openCreate}
            icon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Add Product
          </Button>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="table-header w-10">
                    <input
                      type="checkbox"
                      className="rounded"
                      onChange={(e) =>
                        setSelected(
                          e.target.checked ? filtered.map((p) => p._id) : [],
                        )
                      }
                      checked={
                        selected.length === filtered.length &&
                        filtered.length > 0
                      }
                    />
                  </th>
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Featured",
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
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : filtered.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selected.includes(product._id)}
                            onChange={(e) =>
                              setSelected(
                                e.target.checked
                                  ? [...selected, product._id]
                                  : selected.filter((id) => id !== product._id),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-white font-medium line-clamp-1">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {typeof product.category === "object"
                            ? product.category.name
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-white font-semibold">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              product.stock === 0
                                ? "danger"
                                : product.stock < 10
                                  ? "warning"
                                  : "success"
                            }
                          >
                            {product.stock}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {product.featured ? (
                            <ToggleRight className="w-5 h-5 text-blue-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-500" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? "Edit Product" : "Add Product"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Product Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="label">Price *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input resize-none"
                placeholder="Product description"
              />
            </div>
            <div className="col-span-2">
              <label className="label">Image URLs (one per line)</label>
              <textarea
                rows={3}
                value={form.images.join("\n")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    images: e.target.value.split("\n").filter(Boolean),
                  })
                }
                className="input resize-none text-sm"
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="rounded"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Featured Product
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
