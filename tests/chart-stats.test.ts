import { describe, expect, it } from "vitest";
import { buildPriceTicks, latestCandleStats } from "@/lib/utils/chart-stats";
import type { CandlePoint } from "@/lib/utils/candles";

const candles: CandlePoint[] = [
  { timestamp: "2026-06-09T00:00:00.000Z", open: 100, high: 110, low: 95, close: 108 },
  { timestamp: "2026-06-09T01:00:00.000Z", open: 108, high: 120, low: 104, close: 112 }
];

describe("chart stats", () => {
  it("builds descending price ticks", () => {
    expect(buildPriceTicks(95, 120, 4)).toEqual([120, 111.67, 103.33, 95]);
  });

  it("returns latest candle growth stats", () => {
    expect(latestCandleStats(candles)).toEqual({
      open: 108,
      high: 120,
      low: 104,
      close: 112,
      change: 4,
      changePercent: 3.7037037037037033
    });
  });
});
