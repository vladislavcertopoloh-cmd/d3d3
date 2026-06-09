"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { shouldTriggerAlert } from "@/hooks/use-alert-engine";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { PriceAlert } from "@/types/market";

export default function AlertsPage() {
  const [asset, setAsset] = useState("BTC");
  const [quote, setQuote] = useState("USD");
  const [targetPrice, setTargetPrice] = useState(70000);
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [currentPrice, setCurrentPrice] = useState(68000);
  const [alerts, setAlerts] = useLocalStorage<PriceAlert[]>("ratescope:alerts", []);

  function addAlert() {
    const next: PriceAlert = {
      id: `${asset.toUpperCase()}-${quote.toUpperCase()}-${condition}-${targetPrice}`,
      asset: asset.toUpperCase(),
      quote: quote.toUpperCase(),
      targetPrice,
      condition,
      enabled: true,
      createdAt: new Date().toISOString()
    };
    setAlerts([next, ...alerts.filter((item) => item.id !== next.id)]);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Alerts</h1>
      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-6">
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={asset} onChange={(event) => setAsset(event.target.value)} aria-label="Asset" />
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={quote} onChange={(event) => setQuote(event.target.value)} aria-label="Quote" />
          <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={condition} onChange={(event) => setCondition(event.target.value as "above" | "below")}>
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" type="number" value={targetPrice} onChange={(event) => setTargetPrice(Number(event.target.value))} aria-label="Target price" />
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" type="number" value={currentPrice} onChange={(event) => setCurrentPrice(Number(event.target.value))} aria-label="Current price simulation" />
          <button className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200" onClick={addAlert}>Add alert</button>
        </div>
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-400">No alerts yet. Create a local threshold alert above.</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((item) => {
              const triggered = shouldTriggerAlert(item, currentPrice);
              return (
                <div key={item.id} className="flex flex-col justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">{item.asset}/{item.quote} {item.condition} {item.targetPrice.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Current simulation: {currentPrice.toLocaleString()}</p>
                  </div>
                  <span className={triggered ? "rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300" : "rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300"}>
                    {triggered ? "Triggered" : "Waiting"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
