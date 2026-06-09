"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { getCandleBucketSize, selectHistoryForRange } from "@/lib/utils/chart-range";
import { latestCandleStats } from "@/lib/utils/chart-stats";
import { buildCandlesFromHistory } from "@/lib/utils/candles";
import { formatPercent } from "@/lib/utils/format";
import type { ChartRange, HistoricalPoint } from "@/types/market";

const ranges: ChartRange[] = ["1H", "24H", "7D", "1M", "6M", "1Y"];

export function MarketLineChart({ data }: { data: HistoricalPoint[] }) {
  const [selectedRange, setSelectedRange] = useState<ChartRange>("7D");
  const visibleData = selectHistoryForRange(data, selectedRange);
  const candles = buildCandlesFromHistory(visibleData, getCandleBucketSize(visibleData.length));
  const values = candles.flatMap((candle) => [candle.high, candle.low]);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;
  const range = Math.max(1, max - min);
  const stats = latestCandleStats(candles);
  const width = 940;
  const height = 325;
  const priceHeight = 288;
  const paddingLeft = 34;
  const paddingRight = 34;
  const paddingTop = 24;
  const chartWidth = width - paddingLeft - paddingRight;
  const step = candles.length > 1 ? chartWidth / (candles.length - 1) : chartWidth / 2;
  const candleWidth = Math.max(9, Math.min(15, step * 0.62));

  function y(value: number) {
    return paddingTop + ((max - value) / range) * (priceHeight - paddingTop);
  }

  return (
    <Card className="h-[30rem] bg-[linear-gradient(135deg,rgba(10,22,35,0.96),rgba(5,13,18,0.92))]">
      <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">BTC/USDT</h2>
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">Candles</span>
            <span className={stats.change >= 0 ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>{formatPercent(stats.changePercent)}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>Range <b className="font-medium text-cyan-200">{selectedRange}</b></span>
            <span>Candles <b className="font-medium text-slate-200">{candles.length}</b></span>
            <span>O <b className="font-medium text-slate-200">{stats.open.toFixed(2)}</b></span>
            <span>H <b className="font-medium text-emerald-300">{stats.high.toFixed(2)}</b></span>
            <span>L <b className="font-medium text-rose-300">{stats.low.toFixed(2)}</b></span>
            <span>C <b className="font-medium text-slate-200">{stats.close.toFixed(2)}</b></span>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {ranges.map((range) => (
            <button
              key={range}
              className={range === selectedRange ? "rounded-md bg-cyan-300 px-2 py-1 text-xs font-semibold text-slate-950" : "rounded-md bg-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/15"}
              onClick={() => setSelectedRange(range)}
              type="button"
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-[82%] overflow-hidden rounded-lg border border-white/10 bg-[#08131f]">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2 text-xs">
          <span className="rounded bg-slate-950/60 px-2 py-1 text-slate-300 backdrop-blur">RateScope</span>
          <span className="rounded bg-slate-950/60 px-2 py-1 text-cyan-200 backdrop-blur">Margin view</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          <defs>
            <linearGradient id="chartGlow" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#123252" stopOpacity="0.42" />
              <stop offset="1" stopColor="#07111a" stopOpacity="0.94" />
            </linearGradient>
            <pattern id="terminalGrid" width="44" height="34" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 34" fill="none" stroke="rgba(83,111,140,0.13)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#chartGlow)" />
          <rect width={width} height={height} fill="url(#terminalGrid)" />
          {candles.map((candle, index) => {
            const x = paddingLeft + index * step;
            const openY = y(candle.open);
            const closeY = y(candle.close);
            const highY = y(candle.high);
            const lowY = y(candle.low);
            const isUp = candle.close >= candle.open;
            const color = isUp ? "#38d996" : "#ff6b6b";
            const wickColor = isUp ? "rgba(56,217,150,0.82)" : "rgba(255,107,107,0.82)";
            const bodyY = Math.min(openY, closeY);
            const bodyHeight = Math.max(8, Math.abs(closeY - openY));

            return (
              <g key={`${candle.timestamp}-${index}`}>
                <line x1={x} x2={x} y1={highY} y2={lowY} stroke={wickColor} strokeWidth="2" strokeLinecap="round" />
                <rect x={x - candleWidth / 2} y={bodyY} width={candleWidth} height={bodyHeight} rx="2" fill={color} />
              </g>
            );
          })}
          <line x1={paddingLeft} x2={width - paddingRight} y1={y(stats.close)} y2={y(stats.close)} stroke={stats.change >= 0 ? "#38d996" : "#ff6b6b"} strokeDasharray="4 8" strokeOpacity="0.55" />
        </svg>
      </div>
    </Card>
  );
}
