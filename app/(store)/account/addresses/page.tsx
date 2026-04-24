"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Trash2, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { IAddress } from "@/types";
import toast from "react-hot-toast";

const emptyAddress: Omit<IAddress, "_id"> = {
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
  isDefault: false,
};

export default function AddressesPage() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyAddress });
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    if (!session?.user?.id) return;
    const res = await fetch(`/api/users/${session.user.id}`);
    const data = await res.json();
    setAddresses(data.addresses || []);
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchAddresses();
  }, [session]);

  const handleSave = async () => {
    if (!form.name || !form.street || !form.city || !form.state || !form.zip) {
      toast.error("Please fill all fields");
      return;
    }
    setSaving(true);
    try {
      const currentAddresses = [...addresses];
      if (form.isDefault) {
        currentAddresses.forEach((a) => (a.isDefault = false));
      }
      const updated = [
        ...currentAddresses,
        { ...form, _id: Date.now().toString() },
      ];
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updated }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Address saved!");
      setModalOpen(false);
      setForm({ ...emptyAddress });
      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    const updated = addresses.filter((a) => a._id !== addressId);
    await fetch(`/api/users/${session?.user?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: updated }),
    });
    toast.success("Address deleted");
    fetchAddresses();
  };

  const handleSetDefault = async (addressId: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a._id === addressId,
    }));
    await fetch(`/api/users/${session?.user?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: updated }),
    });
    toast.success("Default address updated");
    fetchAddresses();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Saved Addresses
        </h1>
        <Button
          onClick={() => {
            setForm({ ...emptyAddress });
            setModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Address
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-5 h-32 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No saved addresses yet
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`card p-5 relative ${address.isDefault ? "border-blue-300 dark:border-blue-600" : ""}`}
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" /> Default
                </span>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {address.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {address.street}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {address.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id!)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address._id!)}
                  className="ml-auto flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Address"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="label">Street Address *</label>
            <input
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="input"
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">City *</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="label">State *</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="input"
                placeholder="NY"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">ZIP Code *</label>
              <input
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                className="input"
                placeholder="10001"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="input"
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="PK">Pakistan</option>
                <option value="IN">India</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
              className="rounded text-blue-600"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Set as default address
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save Address
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
