import type { ChartRange, HistoricalPoint } from "@/types/market";

const pointCountByRange: Record<ChartRange, number | undefined> = {
  "1H": 18,
  "24H": 48,
  "7D": 112,
  "1M": 180,
  "6M": 300,
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
