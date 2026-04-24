"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { User, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${session?.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await update({ name });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        My Account
      </h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {session.user.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {session.user.email}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
              {session.user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label flex items-center gap-1.5">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              type="email"
              value={session.user.email || ""}
              disabled
              className="input opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          loading={saving}
          icon={<Save className="w-4 h-4" />}
          className="mt-6"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
