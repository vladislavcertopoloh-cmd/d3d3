import { fallbackCrypto, fallbackFiat, fallbackHistory } from "@/lib/api/fallback-data";
import { fetchCryptoHistory, fetchCryptoMarkets } from "@/lib/api/coingecko";
import { fetchFiatRates } from "@/lib/api/fiat";
import type { ChartRange } from "@/types/market";

export async function getCryptoMarkets(currency = "USD") {
  try {
    return { data: await fetchCryptoMarkets(currency), status: { state: "live" as const, lastUpdated: new Date().toISOString() } };
  } catch {
    return { data: fallbackCrypto, status: { state: "offline" as const, lastUpdated: new Date().toISOString(), message: "Using fallback crypto data." } };
  }
}

export async function getFiatRates(base = "USD") {
  try {
    return { data: await fetchFiatRates(base), status: { state: "live" as const, lastUpdated: new Date().toISOString() } };
  } catch {
    return { data: fallbackFiat, status: { state: "offline" as const, lastUpdated: new Date().toISOString(), message: "Using fallback fiat data." } };
  }
}

export async function getHistory(asset: string, currency: string, range: ChartRange) {
  try {
    return { data: await fetchCryptoHistory(asset, currency, range), status: { state: "live" as const, lastUpdated: new Date().toISOString() } };
  } catch {
    return { data: fallbackHistory, status: { state: "offline" as const, lastUpdated: new Date().toISOString(), message: "Using fallback chart data." } };
  }
}
