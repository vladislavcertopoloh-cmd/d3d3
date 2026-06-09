export type AssetType = "fiat" | "crypto";
export type ApiState = "live" | "updating" | "offline" | "rate_limited";
export type ChartRange = "1H" | "24H" | "7D" | "1M" | "6M" | "1Y";

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
  icon?: string;
}

export interface FiatCurrency extends Asset {
  type: "fiat";
  rateToBase: number;
  baseCurrency: string;
  updatedAt: string;
}

export interface CryptoCurrency extends Asset {
  type: "crypto";
  price: number;
  quoteCurrency: string;
  change24h?: number;
  change7d?: number;
  marketCap?: number;
  volume24h?: number;
  circulatingSupply?: number;
  updatedAt: string;
}

export interface HistoricalPoint {
  timestamp: string;
  value: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  rate: number;
  feePercent: number;
  resultBeforeFee: number;
  resultAfterFee: number;
  reverseRate: number;
  updatedAt: string;
}

export interface FavoritePair {
  id: string;
  base: string;
  quote: string;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  asset: string;
  quote: string;
  targetPrice: number;
  condition: "above" | "below";
  enabled: boolean;
  triggeredAt?: string;
  createdAt: string;
}

export interface ApiStatus {
  state: ApiState;
  lastUpdated?: string;
  message?: string;
}

export interface AppSettings {
  baseCurrency: "USD" | "EUR" | "NOK" | "CAD" | "UAH";
  theme: "dark" | "light" | "system";
  cryptoRefreshSeconds: number;
  fiatRefreshMinutes: number;
  preferredChartRange: ChartRange;
  numberFormat: "compact" | "standard";
}
