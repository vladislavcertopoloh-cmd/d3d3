import { describe, expect, it } from "vitest";
import { normalizeCoinGeckoMarkets, normalizeFiatRates } from "@/lib/api/normalizers";

describe("normalizers", () => {
  it("normalizes CoinGecko market rows", () => {
    const rows = normalizeCoinGeckoMarkets([
      {
        symbol: "btc",
        name: "Bitcoin",
        current_price: 68000,
        price_change_percentage_24h: 1.5,
        price_change_percentage_7d_in_currency: -2.1,
        market_cap: 1200000000000,
        total_volume: 30000000000,
        circulating_supply: 19000000,
        last_updated: "2026-06-09T10:00:00.000Z"
      }
    ], "USD");

    expect(rows[0]?.symbol).toBe("BTC");
    expect(rows[0]?.price).toBe(68000);
    expect(rows[0]?.change7d).toBe(-2.1);
  });

  it("normalizes fiat rates", () => {
    const rows = normalizeFiatRates({ base: "USD", date: "2026-06-09", rates: { NOK: 10.5, EUR: 0.92 } });

    expect(rows).toHaveLength(2);
    expect(rows[0]?.baseCurrency).toBe("USD");
  });
});
