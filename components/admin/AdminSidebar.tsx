"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingBag,
  Users,
  BarChart3,
  Tag,
  Star,
  ChevronLeft,
  ChevronRight,
  Package2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons" },
  { href: "/admin/reviews", icon: Star, label: "Reviews" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-slate-800">
        {!collapsed && (
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold"
          >
            <Package2 className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <span className="text-blue-400">ShopElite</span>
          </Link>
        )}
        {collapsed && <Package2 className="w-6 h-6 text-blue-400 mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : ""}
              className={cn(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 group",
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm",
            collapsed && "justify-center",
          )}
        >
          <Package className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "View Store"}
        </Link>
      </div>
    </aside>
  );
}
