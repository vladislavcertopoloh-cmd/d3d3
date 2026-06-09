"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchShortcut } from "@/hooks/use-search-shortcut";
import type { Asset } from "@/types/market";

export function GlobalSearch({ assets }: { assets: Asset[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  useSearchShortcut(() => setOpen(true));

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return assets.slice(0, 6);
    }

    return assets.filter((asset) => `${asset.symbol} ${asset.name} ${asset.type}`.toLowerCase().includes(normalized)).slice(0, 8);
  }, [assets, query]);

  return (
    <div className="relative">
      <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-slate-300 shadow-soft backdrop-blur transition hover:bg-white/10" onClick={() => setOpen(true)}>
        <Search size={16} />
        Search markets
        <span className="rounded border border-white/10 px-1.5 py-0.5 text-xs text-slate-500">Ctrl K</span>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-[min(90vw,28rem)] rounded-xl border border-white/10 bg-panel/95 p-3 shadow-soft backdrop-blur-xl">
          <input autoFocus className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" placeholder="Search BTC, NOK, Ethereum..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="mt-3 space-y-1">
            {results.map((asset) => (
              <button key={`${asset.type}-${asset.symbol}`} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-white/10" onClick={() => setOpen(false)}>
                <span>
                  <span className="font-medium">{asset.symbol}</span>
                  <span className="ml-2 text-sm text-slate-400">{asset.name}</span>
                </span>
                <span className="text-xs uppercase text-slate-500">{asset.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
