import type { CandlePoint } from "@/lib/utils/candles";

export function buildPriceTicks(min: number, max: number, count = 5) {
  if (count <= 1) {
    return [Number(max.toFixed(2))];
  }

  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, index) => Number((max - step * index).toFixed(2)));
}

export function latestCandleStats(candles: CandlePoint[]) {
  const latest = candles[candles.length - 1];

  if (!latest) {
    return { open: 0, high: 0, low: 0, close: 0, change: 0, changePercent: 0 };
  }

  const change = latest.close - latest.open;

  return {
    open: latest.open,
    high: latest.high,
    low: latest.low,
    close: latest.close,
    change,
    changePercent: latest.open === 0 ? 0 : (change / latest.open) * 100
  };
}
