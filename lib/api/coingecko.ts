import { normalizeCoinGeckoMarkets } from "@/lib/api/normalizers";
import type { ChartRange, HistoricalPoint } from "@/types/market";

const ids = "bitcoin,ethereum,solana,ripple,binancecoin,dogecoin,cardano,tether";
const coinIdsBySymbol: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  BNB: "binancecoin",
  DOGE: "dogecoin",
  ADA: "cardano",
  USDT: "tether"
};

export async function fetchCryptoMarkets(quoteCurrency = "usd") {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${quoteCurrency.toLowerCase()}&ids=${ids}&price_change_percentage=7d`;
  const response = await fetch(url, { next: { revalidate: 45 } });

  if (!response.ok) {
    throw new Error(`CoinGecko failed: ${response.status}`);
  }

  return normalizeCoinGeckoMarkets(await response.json(), quoteCurrency.toUpperCase());
}

export async function fetchCryptoHistory(asset: string, currency: string, range: ChartRange): Promise<HistoricalPoint[]> {
  const id = coinIdsBySymbol[asset.toUpperCase()] ?? asset.toLowerCase();
  const days = range === "1H" || range === "24H" ? 1 : range === "7D" ? 7 : range === "1M" ? 30 : range === "6M" ? 180 : 365;
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`;
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    throw new Error(`CoinGecko history failed: ${response.status}`);
  }

  const payload = await response.json();
  return (payload.prices ?? []).map(([timestamp, value]: [number, number]) => ({
    timestamp: new Date(timestamp).toISOString(),
    value
  }));
}
