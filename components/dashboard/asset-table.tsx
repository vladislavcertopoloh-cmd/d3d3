import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { CryptoCurrency, FiatCurrency } from "@/types/market";

export function AssetTable({ assets, currency = "USD" }: { assets: Array<CryptoCurrency | FiatCurrency>; currency?: string }) {
  if (assets.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-950/45 p-8 text-center text-sm text-slate-400">
        Loading market rows...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-slate-950/45 shadow-soft backdrop-blur-xl">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-white/[0.06] text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Asset</th>
            <th className="px-4 py-3">Price / Rate</th>
            <th className="px-4 py-3">24h</th>
            <th className="px-4 py-3">7d</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const value = asset.type === "crypto" ? asset.price : asset.rateToBase;
            const change24h = asset.type === "crypto" ? asset.change24h : undefined;
            const change7d = asset.type === "crypto" ? asset.change7d : undefined;

            return (
              <tr key={`${asset.type}-${asset.symbol}`} className="border-t border-white/10 transition hover:bg-white/[0.035]">
                <td className="px-4 py-3 font-medium">
                  <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs">{asset.symbol.slice(0, 2)}</span>
                  {asset.symbol} <span className="ml-2 text-slate-500">{asset.name}</span>
                </td>
                <td className="px-4 py-3">{asset.type === "crypto" ? formatCurrency(value, currency, "compact") : value.toFixed(4)}</td>
                <td className={change24h !== undefined && change24h < 0 ? "px-4 py-3 text-rose-300" : "px-4 py-3 text-emerald-300"}>{change24h === undefined ? "-" : formatPercent(change24h)}</td>
                <td className={change7d !== undefined && change7d < 0 ? "px-4 py-3 text-rose-300" : "px-4 py-3 text-emerald-300"}>{change7d === undefined ? "-" : formatPercent(change7d)}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(asset.updatedAt).toLocaleTimeString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
