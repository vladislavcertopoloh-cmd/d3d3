import type { CryptoCurrency, FiatCurrency } from "@/types/market";

export function normalizeCoinGeckoMarkets(rows: unknown[], quoteCurrency: string): CryptoCurrency[] {
  return rows.map((item) => {
    const row = item as Record<string, unknown>;

    return {
      type: "crypto",
      symbol: String(row.symbol ?? "").toUpperCase(),
      name: String(row.name ?? ""),
      price: Number(row.current_price ?? 0),
      quoteCurrency,
      change24h: Number(row.price_change_percentage_24h ?? 0),
      change7d: Number(row.price_change_percentage_7d_in_currency ?? 0),
      marketCap: Number(row.market_cap ?? 0),
      volume24h: Number(row.total_volume ?? 0),
      circulatingSupply: Number(row.circulating_supply ?? 0),
      updatedAt: String(row.last_updated ?? new Date().toISOString())
    };
  });
}

const fiatNames: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  NOK: "Norwegian Krone",
  CAD: "Canadian Dollar",
  GBP: "British Pound",
  CHF: "Swiss Franc",
  PLN: "Polish Zloty",
  UAH: "Ukrainian Hryvnia"
};

export function normalizeFiatRates(payload: { base: string; date: string; rates: Record<string, number> }): FiatCurrency[] {
  const updatedAt = `${payload.date}T00:00:00.000Z`;

  return Object.entries(payload.rates).map(([symbol, rate]) => ({
    type: "fiat",
    symbol,
    name: fiatNames[symbol] ?? symbol,
    rateToBase: rate,
    baseCurrency: payload.base,
    updatedAt
  }));
}
