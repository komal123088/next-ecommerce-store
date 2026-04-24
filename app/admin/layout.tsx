import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AdminSidebar />
      <div className="transition-all duration-300 ml-64">{children}</div>
    </div>
  );
}
