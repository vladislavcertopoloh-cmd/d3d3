import { describe, expect, it } from "vitest";
import { selectHistoryForRange } from "@/lib/utils/chart-range";
import type { HistoricalPoint } from "@/types/market";

const points: HistoricalPoint[] = Array.from({ length: 120 }, (_, index) => ({
  timestamp: `2026-06-09T${String(index).padStart(2, "0")}:00:00.000Z`,
  value: index
}));

describe("selectHistoryForRange", () => {
  it("returns fewer points for shorter ranges", () => {
    expect(selectHistoryForRange(points, "1H")).toHaveLength(32);
    expect(selectHistoryForRange(points, "24H")).toHaveLength(56);
    expect(selectHistoryForRange(points, "7D")).toHaveLength(84);
  });

  it("returns all points for long ranges", () => {
    expect(selectHistoryForRange(points, "1M")).toHaveLength(120);
    expect(selectHistoryForRange(points, "6M")).toHaveLength(120);
    expect(selectHistoryForRange(points, "1Y")).toHaveLength(120);
  });
});
