"use client";

import { fallbackHistory } from "@/lib/api/fallback-data";
import { AssetTable } from "@/components/dashboard/asset-table";
import { MarketStatusCard } from "@/components/dashboard/market-status-card";
import { ConverterPanel } from "@/components/converter/converter-panel";
import { MarketLineChart } from "@/components/charts/market-line-chart";
import { GlobalSearch } from "@/components/search/global-search";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMarketData } from "@/hooks/use-market-data";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

export function DashboardView() {
  const { crypto, fiat, status } = useMarketData("USD");
  const assets = [...crypto, ...fiat];
  const featured = crypto.slice(0, 4);
  const movers = [...crypto].sort((a, b) => Math.abs(b.change24h ?? 0) - Math.abs(a.change24h ?? 0)).slice(0, 3);

  return (
    <div className="space-y-7">
      <header className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/55 p-5 shadow-soft backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={status.state === "live" ? "positive" : status.state === "updating" ? "warning" : "negative"}>{status.state.replace("_", " ")}</Badge>
              <span className="text-xs text-slate-500">Auto-refreshing markets</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">RateScope</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">A real-time market lens for fiat rates, crypto prices, conversion flows, watchlists, and local alerts.</p>
          </div>
          <GlobalSearch assets={assets} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(featured.length ? featured : crypto).slice(0, 4).map((asset) => (
            <div key={asset.symbol} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{asset.symbol}</p>
                <span className={(asset.change24h ?? 0) < 0 ? "text-sm text-rose-300" : "text-sm text-emerald-300"}>{formatPercent(asset.change24h ?? 0)}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(asset.price, "USD", "compact")}</p>
              <p className="mt-1 text-xs text-slate-500">{asset.name}</p>
            </div>
          ))}
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-4">
        <MarketStatusCard status={status} />
        <Card className="bg-cyan-300/10">
          <p className="text-sm text-cyan-100/70">Tracked crypto</p>
          <p className="mt-2 text-3xl font-semibold">{crypto.length}</p>
        </Card>
        <Card className="bg-emerald-300/10">
          <p className="text-sm text-emerald-100/70">Tracked fiat</p>
          <p className="mt-2 text-3xl font-semibold">{fiat.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Top mover</p>
          <p className="mt-2 text-2xl font-semibold">{movers[0]?.symbol ?? "..."}</p>
          <p className={(movers[0]?.change24h ?? 0) < 0 ? "mt-1 text-sm text-rose-300" : "mt-1 text-sm text-emerald-300"}>{movers[0] ? formatPercent(movers[0].change24h ?? 0) : "Loading"}</p>
        </Card>
      </div>
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <MarketLineChart data={fallbackHistory} />
        <div className="space-y-4">
          <ConverterPanel />
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Top movers</h2>
              <span className="text-xs text-slate-500">24h</span>
            </div>
            <div className="mt-3 space-y-2">
              {movers.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2">
                  <span className="font-medium">{asset.symbol}</span>
                  <span className={(asset.change24h ?? 0) < 0 ? "text-rose-300" : "text-emerald-300"}>{formatPercent(asset.change24h ?? 0)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">Live crypto</p>
            <h2 className="text-xl font-semibold">Crypto markets</h2>
          </div>
          <Badge>CoinGecko</Badge>
        </div>
        <AssetTable assets={crypto} />
      </section>
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">Currency rates</p>
            <h2 className="text-xl font-semibold">Fiat rates</h2>
          </div>
          <Badge>Frankfurter</Badge>
        </div>
        <AssetTable assets={fiat} />
      </section>
    </div>
  );
}
