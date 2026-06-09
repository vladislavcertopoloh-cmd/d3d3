import type { HistoricalPoint } from "@/types/market";

export interface CandlePoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function buildCandlesFromHistory(points: HistoricalPoint[], bucketSize = 3): CandlePoint[] {
  if (points.length === 0) {
    return [];
  }

  const size = Math.max(1, bucketSize);
  const candles: CandlePoint[] = [];

  for (let index = 0; index < points.length; index += size) {
    const bucket = points.slice(index, index + size);
    const values = bucket.map((point) => point.value);
    const first = bucket[0];
    const last = bucket[bucket.length - 1];

    if (!first || !last) {
      continue;
    }

    const previous = points[Math.max(0, index - 1)];
    const open = size === 1 && previous ? previous.value : first.value;
    const high = Math.max(...values, open, last.value);
    const low = Math.min(...values, open, last.value);

    candles.push({
      timestamp: last.timestamp,
      open,
      high: Number((high * 1.02).toFixed(2)),
      low: Number((low * 0.98).toFixed(2)),
      close: last.value
    });
  }

  return candles;
}
