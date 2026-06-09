"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { calculateConversion } from "@/lib/utils/conversion";
import { formatCurrency } from "@/lib/utils/format";
import { numberFromInput } from "@/lib/utils/input";
import { allMarketSymbols, resolveConversionRate } from "@/lib/utils/market-lookup";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMarketData } from "@/hooks/use-market-data";
import type { ConversionResult } from "@/types/market";

export function ConverterPanel() {
  const [amountInput, setAmountInput] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NOK");
  const [feeInput, setFeeInput] = useState("0");
  const [recent, setRecent] = useLocalStorage<ConversionResult[]>("ratescope:recent-conversions", []);
  const { crypto, fiat } = useMarketData("USD");
  const symbols = allMarketSymbols({ fiat, crypto });
  const rate = useMemo(() => resolveConversionRate(from, to, { fiat, crypto }), [crypto, fiat, from, to]);
  const amount = numberFromInput(amountInput);
  const fee = numberFromInput(feeInput);
  const result = useMemo(() => calculateConversion({ from, to, amount, rate, feePercent: fee }), [amount, fee, from, rate, to]);

  function saveRecent() {
    setRecent([result, ...recent.filter((item) => item.from !== result.from || item.to !== result.to)].slice(0, 5));
  }

  return (
    <Card className="bg-slate-950/60">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Converter</h2>
          <span className="rounded-full bg-cyan-300/15 px-2.5 py-1 text-xs text-cyan-200">Live rate</span>
        </div>
        <p className="mt-1 text-sm text-slate-400">Convert fiat and crypto with fee simulation.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1 text-xs text-slate-400">
          Amount
          <input
            className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
            inputMode="decimal"
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
            onFocus={() => amountInput === "0" && setAmountInput("")}
          />
        </label>
        <label className="grid gap-1 text-xs text-slate-400">
          From
          <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={from} onChange={(event) => setFrom(event.target.value)}>
            {(symbols.length ? symbols : ["USD", "NOK", "BTC", "ETH"]).map((symbol) => <option key={symbol}>{symbol}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-slate-400">
          To
          <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={to} onChange={(event) => setTo(event.target.value)}>
            {(symbols.length ? symbols : ["USD", "NOK", "BTC", "ETH"]).map((symbol) => <option key={symbol}>{symbol}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-slate-400">
          Fee %
          <input
            className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
            inputMode="decimal"
            value={feeInput}
            onChange={(event) => setFeeInput(event.target.value)}
            onFocus={() => feeInput === "0" && setFeeInput("")}
          />
        </label>
        <button className="self-end rounded-md bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(88,196,221,0.24)] hover:bg-cyan-200" onClick={saveRecent}>Save</button>
      </div>
      <div className="mt-4 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-4">
        <p className="text-xs uppercase tracking-wide text-cyan-100/70">Estimated result</p>
        <p className="mt-1 text-3xl font-semibold">{to.length === 3 ? formatCurrency(result.resultAfterFee, to, "standard") : result.resultAfterFee.toLocaleString()}</p>
        <p className="mt-1 text-sm text-slate-400">Reverse rate: {result.reverseRate.toFixed(6)}</p>
      </div>
      {recent.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="mb-2 text-xs uppercase text-slate-500">Recent conversions</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((item) => (
              <span key={`${item.from}-${item.to}-${item.updatedAt}`} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">
                {item.amount} {item.from} to {item.to}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
