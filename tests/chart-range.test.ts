import { describe, expect, it } from "vitest";
import { getCandleBucketSize, selectHistoryForRange } from "@/lib/utils/chart-range";
import type { HistoricalPoint } from "@/types/market";

const points: HistoricalPoint[] = Array.from({ length: 365 }, (_, index) => ({
  timestamp: `2026-06-09T${String(index).padStart(2, "0")}:00:00.000Z`,
  value: index
}));

describe("selectHistoryForRange", () => {
  it("returns fewer points for shorter ranges", () => {
    expect(selectHistoryForRange(points, "1H")).toHaveLength(18);
    expect(selectHistoryForRange(points, "24H")).toHaveLength(48);
    expect(selectHistoryForRange(points, "7D")).toHaveLength(112);
  });

  it("returns different depths for long ranges", () => {
    expect(selectHistoryForRange(points, "1M")).toHaveLength(180);
    expect(selectHistoryForRange(points, "6M")).toHaveLength(300);
    expect(selectHistoryForRange(points, "1Y")).toHaveLength(365);
  });

  it("compresses dense ranges into readable candles", () => {
    expect(getCandleBucketSize(18)).toBe(1);
    expect(getCandleBucketSize(48)).toBe(2);
    expect(getCandleBucketSize(112)).toBe(3);
    expect(getCandleBucketSize(180)).toBe(4);
    expect(getCandleBucketSize(300)).toBe(7);
    expect(getCandleBucketSize(365)).toBe(8);
  });
});
