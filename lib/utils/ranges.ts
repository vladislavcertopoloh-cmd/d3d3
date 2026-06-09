import type { HistoricalPoint } from "@/types/market";

export function calculateRangeStats(points: HistoricalPoint[]) {
  if (points.length === 0) {
    return { percentChange: 0, high: 0, low: 0 };
  }

  const values = points.map((point) => point.value);
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? first;

  return {
    percentChange: first === 0 ? 0 : ((last - first) / first) * 100,
    high: Math.max(...values),
    low: Math.min(...values)
  };
}
