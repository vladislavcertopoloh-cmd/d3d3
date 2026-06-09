import { describe, expect, it } from "vitest";
import { resolveConversionRate } from "@/lib/utils/market-lookup";
import type { CryptoCurrency, FiatCurrency } from "@/types/market";

const fiat: FiatCurrency[] = [
  { type: "fiat", symbol: "USD", name: "US Dollar", rateToBase: 1, baseCurrency: "USD", updatedAt: "2026-06-09T00:00:00.000Z" },
  { type: "fiat", symbol: "NOK", name: "Norwegian Krone", rateToBase: 10, baseCurrency: "USD", updatedAt: "2026-06-09T00:00:00.000Z" },
  { type: "fiat", symbol: "EUR", name: "Euro", rateToBase: 0.9, baseCurrency: "USD", updatedAt: "2026-06-09T00:00:00.000Z" }
];

const crypto: CryptoCurrency[] = [
  { type: "crypto", symbol: "BTC", name: "Bitcoin", price: 60000, quoteCurrency: "USD", updatedAt: "2026-06-09T00:00:00.000Z" },
  { type: "crypto", symbol: "ETH", name: "Ethereum", price: 3000, quoteCurrency: "USD", updatedAt: "2026-06-09T00:00:00.000Z" }
];

describe("resolveConversionRate", () => {
  it("converts fiat to fiat through USD-normalized rates", () => {
    expect(resolveConversionRate("EUR", "NOK", { fiat, crypto })).toBeCloseTo(11.1111, 4);
  });

  it("converts crypto to fiat", () => {
    expect(resolveConversionRate("BTC", "NOK", { fiat, crypto })).toBe(600000);
  });

  it("converts crypto to crypto", () => {
    expect(resolveConversionRate("BTC", "ETH", { fiat, crypto })).toBe(20);
  });
});
