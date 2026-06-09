import type { CryptoCurrency, FiatCurrency } from "@/types/market";

type MarketSet = {
  fiat: FiatCurrency[];
  crypto: CryptoCurrency[];
};

function priceInUsd(symbol: string, markets: MarketSet) {
  const normalized = symbol.toUpperCase();
  const fiat = markets.fiat.find((asset) => asset.symbol === normalized);

  if (fiat) {
    return fiat.rateToBase === 0 ? undefined : 1 / fiat.rateToBase;
  }

  const crypto = markets.crypto.find((asset) => asset.symbol === normalized);
  return crypto?.price;
}

export function resolveConversionRate(from: string, to: string, markets: MarketSet) {
  const fromUsd = priceInUsd(from, markets);
  const toUsd = priceInUsd(to, markets);

  if (!fromUsd || !toUsd) {
    return 1;
  }

  return fromUsd / toUsd;
}

export function allMarketSymbols(markets: MarketSet) {
  return [...markets.fiat.map((asset) => asset.symbol), ...markets.crypto.map((asset) => asset.symbol)];
}
