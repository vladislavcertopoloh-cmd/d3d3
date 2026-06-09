import type { CryptoCurrency, FiatCurrency, HistoricalPoint } from "@/types/market";

const now = new Date().toISOString();

export const fallbackCrypto: CryptoCurrency[] = [
  { type: "crypto", symbol: "BTC", name: "Bitcoin", price: 68000, quoteCurrency: "USD", change24h: 1.8, change7d: -2.4, marketCap: 1340000000000, volume24h: 32000000000, circulatingSupply: 19700000, updatedAt: now },
  { type: "crypto", symbol: "ETH", name: "Ethereum", price: 3600, quoteCurrency: "USD", change24h: 0.7, change7d: 3.2, marketCap: 432000000000, volume24h: 18000000000, circulatingSupply: 120000000, updatedAt: now },
  { type: "crypto", symbol: "SOL", name: "Solana", price: 155, quoteCurrency: "USD", change24h: -1.1, change7d: 4.8, marketCap: 72000000000, volume24h: 3200000000, circulatingSupply: 465000000, updatedAt: now },
  { type: "crypto", symbol: "XRP", name: "XRP", price: 0.52, quoteCurrency: "USD", change24h: 0.5, change7d: -1.5, marketCap: 29000000000, volume24h: 1200000000, circulatingSupply: 56000000000, updatedAt: now },
  { type: "crypto", symbol: "BNB", name: "BNB", price: 610, quoteCurrency: "USD", change24h: 0.3, change7d: 1.7, marketCap: 90000000000, volume24h: 1800000000, circulatingSupply: 147000000, updatedAt: now },
  { type: "crypto", symbol: "DOGE", name: "Dogecoin", price: 0.16, quoteCurrency: "USD", change24h: -2.1, change7d: 6.4, marketCap: 23000000000, volume24h: 900000000, circulatingSupply: 144000000000, updatedAt: now },
  { type: "crypto", symbol: "ADA", name: "Cardano", price: 0.45, quoteCurrency: "USD", change24h: 1.1, change7d: 0.9, marketCap: 16000000000, volume24h: 500000000, circulatingSupply: 35000000000, updatedAt: now },
  { type: "crypto", symbol: "USDT", name: "Tether", price: 1, quoteCurrency: "USD", change24h: 0.01, change7d: 0.02, marketCap: 112000000000, volume24h: 64000000000, circulatingSupply: 112000000000, updatedAt: now }
];

export const fallbackFiat: FiatCurrency[] = [
  { type: "fiat", symbol: "USD", name: "US Dollar", rateToBase: 1, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "EUR", name: "Euro", rateToBase: 0.92, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "NOK", name: "Norwegian Krone", rateToBase: 10.5, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "CAD", name: "Canadian Dollar", rateToBase: 1.37, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "GBP", name: "British Pound", rateToBase: 0.78, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "CHF", name: "Swiss Franc", rateToBase: 0.9, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "PLN", name: "Polish Zloty", rateToBase: 3.95, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "UAH", name: "Ukrainian Hryvnia", rateToBase: 41.2, baseCurrency: "USD", updatedAt: now }
];

export const fallbackHistory: HistoricalPoint[] = Array.from({ length: 365 }, (_, index) => {
  const wave = Math.sin(index / 11) * 12 + Math.sin(index / 4.5) * 4;
  const yearlyTrend = index < 235 ? index * 0.18 : 42 - (index - 235) * 0.33;
  const monthlyPulse = Math.cos(index / 19) * 5;
  const breakout = index > 285 ? Math.sin((index - 285) / 8) * 14 : 0;

  return {
    timestamp: new Date(Date.now() - (364 - index) * 24 * 60 * 60 * 1000).toISOString(),
    value: 92 + wave + yearlyTrend + monthlyPulse + breakout
  };
});
