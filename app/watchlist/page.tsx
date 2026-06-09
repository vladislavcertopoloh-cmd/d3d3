"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { FavoritePair } from "@/types/market";

export default function WatchlistPage() {
  const [base, setBase] = useState("BTC");
  const [quote, setQuote] = useState("USD");
  const [favorites, setFavorites] = useLocalStorage<FavoritePair[]>("ratescope:watchlist", []);

  function addFavorite() {
    const pair = `${base.toUpperCase()}/${quote.toUpperCase()}`;
    const next: FavoritePair = {
      id: pair,
      base: base.toUpperCase(),
      quote: quote.toUpperCase(),
      createdAt: new Date().toISOString()
    };
    setFavorites([next, ...favorites.filter((item) => item.id !== pair)]);
  }

  function removeFavorite(id: string) {
    setFavorites(favorites.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Watchlist</h1>
      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={base} onChange={(event) => setBase(event.target.value)} aria-label="Base asset" />
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" value={quote} onChange={(event) => setQuote(event.target.value)} aria-label="Quote asset" />
          <button className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200" onClick={addFavorite}>Add pair</button>
        </div>
        {favorites.length === 0 ? (
          <p className="text-sm text-slate-400">No favorites yet. Add pairs like BTC/USD, ETH/NOK, or CAD/NOK.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{item.base}/{item.quote}</p>
                  <button className="text-sm text-rose-300 hover:text-rose-200" onClick={() => removeFavorite(item.id)}>Remove</button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Saved {new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
