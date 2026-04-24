import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange";
}

export function StatsCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  color,
}: StatsCardProps) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg border flex items-center justify-center",
            colors[color],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              positive
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400",
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
