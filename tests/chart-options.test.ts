import { describe, expect, it } from "vitest";
import { chartAssetOptions, chartCurrencyOptions, isSupportedChartAsset, isSupportedChartCurrency } from "@/lib/utils/chart-options";

describe("chart options", () => {
  it("offers supported crypto assets for live history", () => {
    expect(chartAssetOptions.map((asset) => asset.symbol)).toEqual(["BTC", "ETH", "SOL", "XRP", "BNB", "DOGE", "ADA"]);
    expect(isSupportedChartAsset("btc")).toBe(true);
    expect(isSupportedChartAsset("unknown")).toBe(false);
  });

  it("offers supported quote currencies", () => {
    expect(chartCurrencyOptions.map((currency) => currency.code)).toEqual(["USD", "EUR", "NOK", "CAD", "GBP"]);
    expect(isSupportedChartCurrency("usd")).toBe(true);
    expect(isSupportedChartCurrency("rub")).toBe(false);
  });
});
