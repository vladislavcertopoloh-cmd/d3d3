"use client";

import { useCallback, useEffect, useState } from "react";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import type { ApiStatus, CryptoCurrency, FiatCurrency } from "@/types/market";

export function useMarketData(baseCurrency = "USD") {
  const [crypto, setCrypto] = useState<CryptoCurrency[]>([]);
  const [fiat, setFiat] = useState<FiatCurrency[]>([]);
  const [status, setStatus] = useState<ApiStatus>({ state: "updating" });

  const load = useCallback(async () => {
    setStatus((current) => ({ ...current, state: "updating" }));

    try {
      const [cryptoResponse, fiatResponse] = await Promise.all([
        fetch(`/api/markets/crypto?currency=${baseCurrency}`).then((res) => res.json()),
        fetch(`/api/markets/fiat?base=${baseCurrency}`).then((res) => res.json())
      ]);

      setCrypto(cryptoResponse.data);
      setFiat(fiatResponse.data);
      setStatus(
        cryptoResponse.status.state === "live" && fiatResponse.status.state === "live"
          ? cryptoResponse.status
          : { state: "offline", lastUpdated: new Date().toISOString(), message: "Using fallback data." }
      );
    } catch {
      setStatus({ state: "offline", lastUpdated: new Date().toISOString(), message: "Could not refresh market data." });
    }
  }, [baseCurrency]);

  useEffect(() => {
    void load();
  }, [load]);

  useAutoRefresh(load, 60_000);

  return { crypto, fiat, status, reload: load };
}
