import { describe, expect, it } from "vitest";
import { buildCandlesFromHistory } from "@/lib/utils/candles";

describe("buildCandlesFromHistory", () => {
  it("groups historical points into OHLC candles", () => {
    const candles = buildCandlesFromHistory([
      { timestamp: "2026-06-09T00:00:00.000Z", value: 100 },
      { timestamp: "2026-06-09T01:00:00.000Z", value: 110 },
      { timestamp: "2026-06-09T02:00:00.000Z", value: 90 },
      { timestamp: "2026-06-09T03:00:00.000Z", value: 120 }
    ], 2);

    expect(candles).toEqual([
      { timestamp: "2026-06-09T01:00:00.000Z", open: 100, high: 112.2, low: 98, close: 110 },
      { timestamp: "2026-06-09T03:00:00.000Z", open: 90, high: 122.4, low: 88.2, close: 120 }
    ]);
  });

  it("keeps every point as a candle when bucket size is one", () => {
    const candles = buildCandlesFromHistory([
      { timestamp: "2026-06-09T00:00:00.000Z", value: 100 },
      { timestamp: "2026-06-09T01:00:00.000Z", value: 110 }
    ], 1);

    expect(candles).toHaveLength(2);
    expect(candles[1]).toEqual({ timestamp: "2026-06-09T01:00:00.000Z", open: 100, high: 112.2, low: 98, close: 110 });
  });
});
