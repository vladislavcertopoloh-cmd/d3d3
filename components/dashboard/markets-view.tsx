"use client";

import { fallbackHistory } from "@/lib/api/fallback-data";
import { MarketLineChart } from "@/components/charts/market-line-chart";
import { AssetTable } from "@/components/dashboard/asset-table";
import { GlobalSearch } from "@/components/search/global-search";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMarketData } from "@/hooks/use-market-data";

export function MarketsView() {
  const { crypto, fiat, status } = useMarketData("USD");
  const assets = [...crypto, ...fiat];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-950/55 p-5 shadow-soft backdrop-blur-xl md:flex-row md:items-start md:justify-between">
        <div>
          <Badge tone={status.state === "live" ? "positive" : status.state === "updating" ? "warning" : "negative"}>
            {status.state.replace("_", " ")}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold">Markets</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Crypto prices and fiat rates in one focused market board.
          </p>
        </div>
        <GlobalSearch assets={assets} />
      </header>

      <MarketLineChart data={fallbackHistory} asset="BTC" currency="USD" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-400">Market source</p>
          <p className="mt-2 text-2xl font-semibold">Live + fallback</p>
        </Card>
        <Card className="bg-cyan-300/10">
          <p className="text-sm text-cyan-100/70">Crypto assets</p>
          <p className="mt-2 text-3xl font-semibold">{crypto.length}</p>
        </Card>
        <Card className="bg-emerald-300/10">
          <p className="text-sm text-emerald-100/70">Fiat rates</p>
          <p className="mt-2 text-3xl font-semibold">{fiat.length}</p>
        </Card>
      </div>

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
