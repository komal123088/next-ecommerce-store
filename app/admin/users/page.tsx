"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, ShieldCheck, ShieldOff, Ban } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    const url = search
      ? `/api/users?search=${encodeURIComponent(search)}`
      : "/api/users";
    const res = await fetch(url);
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const updateUser = async (id: string, data: any) => {
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    toast.success("User updated");
    load();
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Users" subtitle="Manage platform users" />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <span className="text-slate-400 text-sm">{users.length} users</span>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {[
                    "User",
                    "Email",
                    "Role",
                    "Orders",
                    "Joined",
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
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {user.name?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <span className="text-white font-medium">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={user.role === "admin" ? "info" : "default"}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {user.orderCount || 0}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={user.banned ? "danger" : "success"}>
                            {user.banned ? "Banned" : "Active"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                updateUser(user._id, {
                                  role:
                                    user.role === "admin" ? "user" : "admin",
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                              title={
                                user.role === "admin"
                                  ? "Remove admin"
                                  : "Make admin"
                              }
                            >
                              {user.role === "admin" ? (
                                <ShieldOff className="w-4 h-4" />
                              ) : (
                                <ShieldCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                updateUser(user._id, { banned: !user.banned })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                              title={user.banned ? "Unban" : "Ban"}
                            >
                              <Ban className="w-4 h-4" />
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
    </div>
  );
}
