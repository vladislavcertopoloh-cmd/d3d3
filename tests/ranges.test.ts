import { describe, expect, it } from "vitest";
import { calculateRangeStats } from "@/lib/utils/ranges";

describe("calculateRangeStats", () => {
  it("calculates change high and low", () => {
    const stats = calculateRangeStats([
      { timestamp: "2026-06-09T00:00:00.000Z", value: 100 },
      { timestamp: "2026-06-09T01:00:00.000Z", value: 120 },
      { timestamp: "2026-06-09T02:00:00.000Z", value: 90 }
    ]);

    expect(stats.percentChange).toBe(-10);
    expect(stats.high).toBe(120);
    expect(stats.low).toBe(90);
  });
});
