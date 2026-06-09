import type { ChartRange, HistoricalPoint } from "@/types/market";

const pointCountByRange: Record<ChartRange, number | undefined> = {
  "1H": 32,
  "24H": 56,
  "7D": 84,
  "1M": 120,
  "6M": 220,
  "1Y": undefined
};

export function selectHistoryForRange(points: HistoricalPoint[], range: ChartRange) {
  const count = pointCountByRange[range];

  if (!count || points.length <= count) {
    return points;
  }

  return points.slice(points.length - count);
}

export function getCandleBucketSize(pointCount: number, maxCandles = 46) {
  return Math.max(1, Math.ceil(pointCount / maxCandles));
}
