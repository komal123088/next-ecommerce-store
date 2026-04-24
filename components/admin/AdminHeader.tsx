"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-6 gap-4">
      <div className="flex-1">
        <h1 className="text-white font-bold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-600">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium">
              {session?.user?.name}
            </p>
            <p className="text-slate-400 text-xs">Administrator</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
