"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, Calculator, Eye, LineChart, Settings, Star, Wifi } from "lucide-react";
import { isNavItemActive, navigationItems } from "@/lib/utils/navigation";
import { cn } from "@/lib/utils/style";

const icons = {
  Activity,
  Bell,
  Calculator,
  LineChart,
  Settings,
  Star
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl lg:block">
      <Link href="/" className="mb-8 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-200/40 hover:bg-white/[0.07]">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(88,196,221,0.28)]">
          <Eye size={20} />
        </div>
        <div>
          <p className="text-lg font-semibold">RateScope</p>
          <p className="text-xs text-slate-400">Live market lens</p>
        </div>
      </Link>
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = icons[item.icon];
          const active = isNavItemActive(item.href, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                active
                  ? "bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(88,196,221,0.18)]"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-lg border border-emerald-300/15 bg-emerald-300/10 p-3 text-sm text-emerald-200">
        <div className="flex items-center gap-2 font-medium">
          <Wifi size={15} />
          Market feeds active
        </div>
        <p className="mt-1 text-xs text-emerald-100/65">CoinGecko and fiat API fallback-safe.</p>
      </div>
    </aside>
  );
}
