import { describe, expect, it } from "vitest";
import { calculateConversion } from "@/lib/utils/conversion";

describe("calculateConversion", () => {
  it("applies rate and fee", () => {
    const result = calculateConversion({ from: "BTC", to: "USD", amount: 2, rate: 50000, feePercent: 1 });

    expect(result.resultBeforeFee).toBe(100000);
    expect(result.resultAfterFee).toBe(99000);
    expect(result.reverseRate).toBe(0.00002);
  });
});
