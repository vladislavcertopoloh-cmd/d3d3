export const chartAssetOptions = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "ADA", name: "Cardano" }
] as const;

export const chartCurrencyOptions = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "GBP", name: "British Pound" }
] as const;

export function isSupportedChartAsset(symbol: string) {
  return chartAssetOptions.some((asset) => asset.symbol === symbol.toUpperCase());
}

export function isSupportedChartCurrency(code: string) {
  return chartCurrencyOptions.some((currency) => currency.code === code.toUpperCase());
}
