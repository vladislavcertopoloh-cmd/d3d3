# RateScope Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the RateScope MVP: a polished Next.js fintech dashboard with live fiat/crypto data, converter, charts, search, watchlist, alerts, settings, and resilient fallback states.

**Architecture:** Use Next.js App Router with TypeScript and Tailwind. Keep UI components separate from API provider details: pages call hooks, hooks call internal API routes, API routes call `lib/api` service modules that normalize public provider responses and fall back cleanly when needed.

**Tech Stack:** Next.js, React, TypeScript strict mode, Tailwind CSS, Recharts, Vitest, Testing Library, localStorage.

---

## File Structure

Create or modify these files:

```text
package.json
next.config.ts
tsconfig.json
postcss.config.mjs
tailwind.config.ts
vitest.config.ts
app/globals.css
app/layout.tsx
app/page.tsx
app/converter/page.tsx
app/markets/page.tsx
app/watchlist/page.tsx
app/alerts/page.tsx
app/settings/page.tsx
app/asset/[symbol]/page.tsx
app/api/markets/fiat/route.ts
app/api/markets/crypto/route.ts
app/api/markets/history/route.ts
app/api/convert/route.ts
components/layout/app-shell.tsx
components/layout/sidebar.tsx
components/dashboard/dashboard-view.tsx
components/dashboard/market-status-card.tsx
components/dashboard/asset-table.tsx
components/converter/converter-panel.tsx
components/charts/market-line-chart.tsx
components/search/global-search.tsx
components/ui/badge.tsx
components/ui/card.tsx
components/ui/skeleton.tsx
hooks/use-auto-refresh.ts
hooks/use-local-storage.ts
hooks/use-market-data.ts
hooks/use-search-shortcut.ts
hooks/use-alert-engine.ts
lib/api/coingecko.ts
lib/api/fiat.ts
lib/api/fallback-data.ts
lib/api/market-data.ts
lib/api/normalizers.ts
lib/utils/conversion.ts
lib/utils/format.ts
lib/utils/ranges.ts
types/market.ts
tests/conversion.test.ts
tests/format.test.ts
tests/ranges.test.ts
tests/normalizers.test.ts
tests/local-storage.test.tsx
tests/alerts.test.ts
```

---

### Task 1: Scaffold Next.js App

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: Create package metadata and scripts**

```json
{
  "name": "ratescope",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.15.0",
    "eslint-config-next": "^15.0.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Add TypeScript config**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Add Tailwind and Vitest config**

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#101419",
        panel: "#161b22",
        accent: "#58c4dd",
        positive: "#38d996",
        negative: "#ff6b6b",
        warning: "#f6c85f"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0,0,0,0.28)"
      }
    }
  },
  plugins: []
};

export default config;
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname
    }
  }
});
```

- [ ] **Step 4: Create app layout and placeholder page**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateScope",
  description: "Real-time fiat and crypto market dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function DashboardPage() {
  return <main>RateScope dashboard loading...</main>;
}
```

- [ ] **Step 5: Run install and verify**

Run: `npm install`

Expected: dependencies install successfully.

Run: `npm run test`

Expected: Vitest starts and reports no test files or passing empty suite.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts vitest.config.ts app
git commit -m "chore: scaffold RateScope Next.js app"
```

---

### Task 2: Add Core Types And Utility Tests

**Files:**
- Create: `types/market.ts`
- Create: `lib/utils/format.ts`
- Create: `lib/utils/conversion.ts`
- Create: `lib/utils/ranges.ts`
- Create: `tests/format.test.ts`
- Create: `tests/conversion.test.ts`
- Create: `tests/ranges.test.ts`

- [ ] **Step 1: Write failing tests for formatting**

```ts
// tests/format.test.ts
import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent, formatUpdatedTime } from "@/lib/utils/format";

describe("format utilities", () => {
  it("formats compact currency", () => {
    expect(formatCurrency(1234567, "USD", "compact")).toBe("$1.23M");
  });

  it("formats percent with sign", () => {
    expect(formatPercent(2.345)).toBe("+2.35%");
    expect(formatPercent(-1.2)).toBe("-1.20%");
  });

  it("formats updated time from ISO input", () => {
    expect(formatUpdatedTime("2026-06-09T10:30:00.000Z")).toContain("Last updated");
  });
});
```

- [ ] **Step 2: Write failing tests for conversion and ranges**

```ts
// tests/conversion.test.ts
import { describe, expect, it } from "vitest";
import { calculateConversion } from "@/lib/utils/conversion";

describe("calculateConversion", () => {
  it("applies rate and fee", () => {
    const result = calculateConversion({ from: "BTC", to: "USD", amount: 2, rate: 50000, feePercent: 1 });

    expect(result.resultBeforeFee).toBe(100000);
    expect(result.resultAfterFee).toBe(99000);
    expect(result.reverseRate).toBe(0.00002);
  });
});
```

```ts
// tests/ranges.test.ts
import { describe, expect, it } from "vitest";
import { calculateRangeStats } from "@/lib/utils/ranges";

describe("calculateRangeStats", () => {
  it("calculates change high and low", () => {
    const stats = calculateRangeStats([
      { timestamp: "2026-06-09T00:00:00.000Z", value: 100 },
      { timestamp: "2026-06-09T01:00:00.000Z", value: 120 },
      { timestamp: "2026-06-09T02:00:00.000Z", value: 90 }
    ]);

    expect(stats.percentChange).toBe(-10);
    expect(stats.high).toBe(120);
    expect(stats.low).toBe(90);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test -- tests/format.test.ts tests/conversion.test.ts tests/ranges.test.ts`

Expected: FAIL because utility modules do not exist.

- [ ] **Step 4: Add core types**

```ts
// types/market.ts
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
```

- [ ] **Step 5: Add utility implementations**

```ts
// lib/utils/format.ts
export function formatCurrency(value: number, currency: string, mode: "compact" | "standard" = "standard") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: mode === "compact" ? "compact" : "standard",
    maximumFractionDigits: mode === "compact" ? 2 : 4
  }).format(value);
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatUpdatedTime(iso: string) {
  return `Last updated: ${new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(iso))}`;
}
```

```ts
// lib/utils/conversion.ts
import type { ConversionResult } from "@/types/market";

export function calculateConversion(input: {
  from: string;
  to: string;
  amount: number;
  rate: number;
  feePercent: number;
}): ConversionResult {
  const resultBeforeFee = input.amount * input.rate;
  const feeMultiplier = 1 - input.feePercent / 100;

  return {
    from: input.from,
    to: input.to,
    amount: input.amount,
    rate: input.rate,
    feePercent: input.feePercent,
    resultBeforeFee,
    resultAfterFee: resultBeforeFee * feeMultiplier,
    reverseRate: input.rate === 0 ? 0 : 1 / input.rate,
    updatedAt: new Date().toISOString()
  };
}
```

```ts
// lib/utils/ranges.ts
import type { HistoricalPoint } from "@/types/market";

export function calculateRangeStats(points: HistoricalPoint[]) {
  if (points.length === 0) {
    return { percentChange: 0, high: 0, low: 0 };
  }

  const values = points.map((point) => point.value);
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? first;

  return {
    percentChange: first === 0 ? 0 : ((last - first) / first) * 100,
    high: Math.max(...values),
    low: Math.min(...values)
  };
}
```

- [ ] **Step 6: Run tests to verify pass**

Run: `npm run test -- tests/format.test.ts tests/conversion.test.ts tests/ranges.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add types lib/utils tests
git commit -m "feat: add market types and utility functions"
```

---

### Task 3: Build API Service Layer With Fallback Data

**Files:**
- Create: `lib/api/fallback-data.ts`
- Create: `lib/api/normalizers.ts`
- Create: `lib/api/coingecko.ts`
- Create: `lib/api/fiat.ts`
- Create: `lib/api/market-data.ts`
- Create: `tests/normalizers.test.ts`

- [ ] **Step 1: Write failing normalizer tests**

```ts
// tests/normalizers.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/normalizers.test.ts`

Expected: FAIL because normalizers do not exist.

- [ ] **Step 3: Add fallback data**

```ts
// lib/api/fallback-data.ts
import type { CryptoCurrency, FiatCurrency, HistoricalPoint } from "@/types/market";

const now = new Date().toISOString();

export const fallbackCrypto: CryptoCurrency[] = [
  { type: "crypto", symbol: "BTC", name: "Bitcoin", price: 68000, quoteCurrency: "USD", change24h: 1.8, change7d: -2.4, marketCap: 1340000000000, volume24h: 32000000000, circulatingSupply: 19700000, updatedAt: now },
  { type: "crypto", symbol: "ETH", name: "Ethereum", price: 3600, quoteCurrency: "USD", change24h: 0.7, change7d: 3.2, marketCap: 432000000000, volume24h: 18000000000, circulatingSupply: 120000000, updatedAt: now },
  { type: "crypto", symbol: "SOL", name: "Solana", price: 155, quoteCurrency: "USD", change24h: -1.1, change7d: 4.8, marketCap: 72000000000, volume24h: 3200000000, circulatingSupply: 465000000, updatedAt: now },
  { type: "crypto", symbol: "USDT", name: "Tether", price: 1, quoteCurrency: "USD", change24h: 0.01, change7d: 0.02, marketCap: 112000000000, volume24h: 64000000000, circulatingSupply: 112000000000, updatedAt: now }
];

export const fallbackFiat: FiatCurrency[] = [
  { type: "fiat", symbol: "USD", name: "US Dollar", rateToBase: 1, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "EUR", name: "Euro", rateToBase: 0.92, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "NOK", name: "Norwegian Krone", rateToBase: 10.5, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "CAD", name: "Canadian Dollar", rateToBase: 1.37, baseCurrency: "USD", updatedAt: now },
  { type: "fiat", symbol: "UAH", name: "Ukrainian Hryvnia", rateToBase: 41.2, baseCurrency: "USD", updatedAt: now }
];

export const fallbackHistory: HistoricalPoint[] = Array.from({ length: 30 }, (_, index) => ({
  timestamp: new Date(Date.now() - (29 - index) * 60 * 60 * 1000).toISOString(),
  value: 100 + Math.sin(index / 3) * 8 + index * 0.7
}));
```

- [ ] **Step 4: Add normalizers and provider clients**

```ts
// lib/api/normalizers.ts
import type { CryptoCurrency, FiatCurrency } from "@/types/market";

export function normalizeCoinGeckoMarkets(rows: any[], quoteCurrency: string): CryptoCurrency[] {
  return rows.map((row) => ({
    type: "crypto",
    symbol: String(row.symbol).toUpperCase(),
    name: String(row.name),
    price: Number(row.current_price ?? 0),
    quoteCurrency,
    change24h: Number(row.price_change_percentage_24h ?? 0),
    change7d: Number(row.price_change_percentage_7d_in_currency ?? 0),
    marketCap: Number(row.market_cap ?? 0),
    volume24h: Number(row.total_volume ?? 0),
    circulatingSupply: Number(row.circulating_supply ?? 0),
    updatedAt: String(row.last_updated ?? new Date().toISOString())
  }));
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
```

```ts
// lib/api/coingecko.ts
import { normalizeCoinGeckoMarkets } from "@/lib/api/normalizers";
import type { ChartRange, HistoricalPoint } from "@/types/market";

const ids = "bitcoin,ethereum,solana,ripple,binancecoin,dogecoin,cardano,tether";

export async function fetchCryptoMarkets(quoteCurrency = "usd") {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${quoteCurrency.toLowerCase()}&ids=${ids}&price_change_percentage=7d`;
  const response = await fetch(url, { next: { revalidate: 45 } });
  if (!response.ok) throw new Error(`CoinGecko failed: ${response.status}`);
  return normalizeCoinGeckoMarkets(await response.json(), quoteCurrency.toUpperCase());
}

export async function fetchCryptoHistory(asset: string, currency: string, range: ChartRange): Promise<HistoricalPoint[]> {
  const days = range === "1H" || range === "24H" ? 1 : range === "7D" ? 7 : range === "1M" ? 30 : range === "6M" ? 180 : 365;
  const url = `https://api.coingecko.com/api/v3/coins/${asset.toLowerCase()}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`;
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`CoinGecko history failed: ${response.status}`);
  const payload = await response.json();
  return (payload.prices ?? []).map(([timestamp, value]: [number, number]) => ({
    timestamp: new Date(timestamp).toISOString(),
    value
  }));
}
```

```ts
// lib/api/fiat.ts
import { normalizeFiatRates } from "@/lib/api/normalizers";

const symbols = "USD,EUR,NOK,CAD,GBP,CHF,PLN,UAH";

export async function fetchFiatRates(base = "USD") {
  const url = `https://api.frankfurter.app/latest?from=${base}&to=${symbols}`;
  const response = await fetch(url, { next: { revalidate: 600 } });
  if (!response.ok) throw new Error(`Fiat rates failed: ${response.status}`);
  return normalizeFiatRates(await response.json());
}
```

```ts
// lib/api/market-data.ts
import { fallbackCrypto, fallbackFiat, fallbackHistory } from "@/lib/api/fallback-data";
import { fetchCryptoHistory, fetchCryptoMarkets } from "@/lib/api/coingecko";
import { fetchFiatRates } from "@/lib/api/fiat";
import type { ChartRange } from "@/types/market";

export async function getCryptoMarkets(currency = "USD") {
  try {
    return { data: await fetchCryptoMarkets(currency), status: { state: "live" as const, lastUpdated: new Date().toISOString() } };
  } catch (error) {
    return { data: fallbackCrypto, status: { state: "offline" as const, lastUpdated: new Date().toISOString(), message: "Using fallback crypto data." } };
  }
}

export async function getFiatRates(base = "USD") {
  try {
    return { data: await fetchFiatRates(base), status: { state: "live" as const, lastUpdated: new Date().toISOString() } };
  } catch (error) {
    return { data: fallbackFiat, status: { state: "offline" as const, lastUpdated: new Date().toISOString(), message: "Using fallback fiat data." } };
  }
}

export async function getHistory(asset: string, currency: string, range: ChartRange) {
  try {
    return { data: await fetchCryptoHistory(asset, currency, range), status: { state: "live" as const, lastUpdated: new Date().toISOString() } };
  } catch (error) {
    return { data: fallbackHistory, status: { state: "offline" as const, lastUpdated: new Date().toISOString(), message: "Using fallback chart data." } };
  }
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm run test -- tests/normalizers.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/api tests/normalizers.test.ts
git commit -m "feat: add market data API service layer"
```

---

### Task 4: Add Next.js API Routes

**Files:**
- Create: `app/api/markets/fiat/route.ts`
- Create: `app/api/markets/crypto/route.ts`
- Create: `app/api/markets/history/route.ts`
- Create: `app/api/convert/route.ts`

- [ ] **Step 1: Add fiat and crypto market routes**

```ts
// app/api/markets/fiat/route.ts
import { NextResponse } from "next/server";
import { getFiatRates } from "@/lib/api/market-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get("base") ?? "USD";
  return NextResponse.json(await getFiatRates(base));
}
```

```ts
// app/api/markets/crypto/route.ts
import { NextResponse } from "next/server";
import { getCryptoMarkets } from "@/lib/api/market-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency") ?? "USD";
  return NextResponse.json(await getCryptoMarkets(currency));
}
```

- [ ] **Step 2: Add history and conversion routes**

```ts
// app/api/markets/history/route.ts
import { NextResponse } from "next/server";
import { getHistory } from "@/lib/api/market-data";
import type { ChartRange } from "@/types/market";

const ranges = new Set(["1H", "24H", "7D", "1M", "6M", "1Y"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get("asset") ?? "bitcoin";
  const currency = searchParams.get("currency") ?? "USD";
  const range = searchParams.get("range") ?? "7D";

  if (!ranges.has(range)) {
    return NextResponse.json({ error: "Unsupported range" }, { status: 400 });
  }

  return NextResponse.json(await getHistory(asset, currency, range as ChartRange));
}
```

```ts
// app/api/convert/route.ts
import { NextResponse } from "next/server";
import { calculateConversion } from "@/lib/utils/conversion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "USD";
  const to = searchParams.get("to") ?? "NOK";
  const amount = Number(searchParams.get("amount") ?? "1");
  const fee = Number(searchParams.get("fee") ?? "0");
  const rate = Number(searchParams.get("rate") ?? "1");

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
  }

  return NextResponse.json(calculateConversion({ from, to, amount, rate, feePercent: fee }));
}
```

- [ ] **Step 3: Verify with build**

Run: `npm run build`

Expected: routes compile successfully.

- [ ] **Step 4: Commit**

```bash
git add app/api
git commit -m "feat: expose market data API routes"
```

---

### Task 5: Add Hooks For Refresh, Storage, Market Data, Search, Alerts

**Files:**
- Create: `hooks/use-local-storage.ts`
- Create: `hooks/use-auto-refresh.ts`
- Create: `hooks/use-market-data.ts`
- Create: `hooks/use-search-shortcut.ts`
- Create: `hooks/use-alert-engine.ts`
- Create: `tests/alerts.test.ts`

- [ ] **Step 1: Write alert logic test**

```ts
// tests/alerts.test.ts
import { describe, expect, it } from "vitest";
import { shouldTriggerAlert } from "@/hooks/use-alert-engine";

describe("shouldTriggerAlert", () => {
  it("triggers above alerts", () => {
    expect(shouldTriggerAlert({ condition: "above", targetPrice: 100 }, 101)).toBe(true);
  });

  it("triggers below alerts", () => {
    expect(shouldTriggerAlert({ condition: "below", targetPrice: 100 }, 99)).toBe(true);
  });
});
```

- [ ] **Step 2: Add hooks**

```ts
// hooks/use-local-storage.ts
"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      setValue(initialValue);
    }
  }, [initialValue, key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage can fail in private mode; keep in-memory state.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
```

```ts
// hooks/use-auto-refresh.ts
"use client";

import { useEffect } from "react";

export function useAutoRefresh(callback: () => void, intervalMs: number, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(callback, intervalMs);
    return () => window.clearInterval(id);
  }, [callback, enabled, intervalMs]);
}
```

```ts
// hooks/use-market-data.ts
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
    const [cryptoResponse, fiatResponse] = await Promise.all([
      fetch(`/api/markets/crypto?currency=${baseCurrency}`).then((res) => res.json()),
      fetch(`/api/markets/fiat?base=${baseCurrency}`).then((res) => res.json())
    ]);
    setCrypto(cryptoResponse.data);
    setFiat(fiatResponse.data);
    setStatus(cryptoResponse.status.state === "live" && fiatResponse.status.state === "live" ? cryptoResponse.status : { state: "offline", lastUpdated: new Date().toISOString() });
  }, [baseCurrency]);

  useEffect(() => {
    void load();
  }, [load]);

  useAutoRefresh(load, 60_000);

  return { crypto, fiat, status, reload: load };
}
```

```ts
// hooks/use-search-shortcut.ts
"use client";

import { useEffect } from "react";

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);
}
```

```ts
// hooks/use-alert-engine.ts
export function shouldTriggerAlert(alert: { condition: "above" | "below"; targetPrice: number }, currentPrice: number) {
  return alert.condition === "above" ? currentPrice >= alert.targetPrice : currentPrice <= alert.targetPrice;
}
```

- [ ] **Step 3: Run alert test**

Run: `npm run test -- tests/alerts.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add hooks tests/alerts.test.ts
git commit -m "feat: add client hooks for RateScope state"
```

---

### Task 6: Build Layout And UI Primitives

**Files:**
- Create: `components/ui/card.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/skeleton.tsx`
- Create: `components/layout/sidebar.tsx`
- Create: `components/layout/app-shell.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add UI primitives**

```tsx
// components/ui/card.tsx
import { cn } from "@/lib/utils/style";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-soft", className)}>{children}</section>;
}
```

```tsx
// components/ui/badge.tsx
import { cn } from "@/lib/utils/style";

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "positive" | "negative" | "warning"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-white/10 text-slate-200",
    positive: "bg-emerald-400/15 text-emerald-300",
    negative: "bg-rose-400/15 text-rose-300",
    warning: "bg-amber-400/15 text-amber-300"
  };

  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}
```

```tsx
// components/ui/skeleton.tsx
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />;
}
```

```ts
// lib/utils/style.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Add shell and sidebar**

```tsx
// components/layout/sidebar.tsx
import Link from "next/link";
import { Activity, Bell, Calculator, Eye, LineChart, Settings, Star } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/converter", label: "Converter", icon: Calculator },
  { href: "/markets", label: "Markets", icon: LineChart },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-white/10 bg-black/20 p-4 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
          <Eye size={20} />
        </div>
        <div>
          <p className="text-lg font-semibold">RateScope</p>
          <p className="text-xs text-slate-400">Live market lens</p>
        </div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

```tsx
// components/layout/app-shell.tsx
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire shell in layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateScope",
  description: "Real-time fiat and crypto market dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components lib/utils/style.ts app
git commit -m "feat: add RateScope app shell"
```

---

### Task 7: Build Dashboard, Tables, Converter, Chart, Search Pages

**Files:**
- Create: `components/dashboard/dashboard-view.tsx`
- Create: `components/dashboard/market-status-card.tsx`
- Create: `components/dashboard/asset-table.tsx`
- Create: `components/converter/converter-panel.tsx`
- Create: `components/charts/market-line-chart.tsx`
- Create: `components/search/global-search.tsx`
- Modify: `app/page.tsx`
- Modify: `app/converter/page.tsx`
- Modify: `app/markets/page.tsx`
- Modify: `app/watchlist/page.tsx`
- Modify: `app/alerts/page.tsx`
- Modify: `app/settings/page.tsx`
- Modify: `app/asset/[symbol]/page.tsx`

- [ ] **Step 1: Add market status card and asset table**

```tsx
// components/dashboard/market-status-card.tsx
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ApiStatus } from "@/types/market";

export function MarketStatusCard({ status }: { status: ApiStatus }) {
  const tone = status.state === "live" ? "positive" : status.state === "updating" ? "warning" : "negative";
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Market status</p>
          <p className="mt-1 text-2xl font-semibold capitalize">{status.state.replace("_", " ")}</p>
        </div>
        <Badge tone={tone}>{status.state}</Badge>
      </div>
      <p className="mt-3 text-sm text-slate-400">{status.lastUpdated ? `Last updated ${new Date(status.lastUpdated).toLocaleTimeString()}` : "Waiting for first update"}</p>
    </Card>
  );
}
```

```tsx
// components/dashboard/asset-table.tsx
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { CryptoCurrency, FiatCurrency } from "@/types/market";

export function AssetTable({ assets, currency = "USD" }: { assets: Array<CryptoCurrency | FiatCurrency>; currency?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-white/[0.04] text-slate-400">
          <tr>
            <th className="px-4 py-3">Asset</th>
            <th className="px-4 py-3">Price / Rate</th>
            <th className="px-4 py-3">24h</th>
            <th className="px-4 py-3">7d</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const value = asset.type === "crypto" ? asset.price : asset.rateToBase;
            const change24h = asset.type === "crypto" ? asset.change24h : undefined;
            const change7d = asset.type === "crypto" ? asset.change7d : undefined;
            return (
              <tr key={`${asset.type}-${asset.symbol}`} className="border-t border-white/10">
                <td className="px-4 py-3 font-medium">{asset.symbol} <span className="text-slate-500">{asset.name}</span></td>
                <td className="px-4 py-3">{asset.type === "crypto" ? formatCurrency(value, currency, "compact") : value.toFixed(4)}</td>
                <td className={change24h && change24h < 0 ? "px-4 py-3 text-rose-300" : "px-4 py-3 text-emerald-300"}>{change24h === undefined ? "-" : formatPercent(change24h)}</td>
                <td className={change7d && change7d < 0 ? "px-4 py-3 text-rose-300" : "px-4 py-3 text-emerald-300"}>{change7d === undefined ? "-" : formatPercent(change7d)}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(asset.updatedAt).toLocaleTimeString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Add converter and chart components**

```tsx
// components/converter/converter-panel.tsx
"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { calculateConversion } from "@/lib/utils/conversion";
import { formatCurrency } from "@/lib/utils/format";

export function ConverterPanel() {
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(10.5);
  const [fee, setFee] = useState(0);
  const result = useMemo(() => calculateConversion({ from: "USD", to: "NOK", amount, rate, feePercent: fee }), [amount, fee, rate]);

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Converter</h2>
        <p className="text-sm text-slate-400">MVP widget with live-rate plumbing ready.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2" type="number" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
        <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2" type="number" value={fee} onChange={(event) => setFee(Number(event.target.value))} />
      </div>
      <p className="mt-4 text-2xl font-semibold">{formatCurrency(result.resultAfterFee, "NOK", "standard")}</p>
      <p className="text-sm text-slate-400">Reverse rate: {result.reverseRate.toFixed(6)}</p>
    </Card>
  );
}
```

```tsx
// components/charts/market-line-chart.tsx
"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import type { HistoricalPoint } from "@/types/market";

export function MarketLineChart({ data }: { data: HistoricalPoint[] }) {
  return (
    <Card className="h-80">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Historical chart</h2>
        <span className="text-sm text-slate-400">7D</span>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <XAxis dataKey="timestamp" hide />
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Tooltip contentStyle={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
          <Line type="monotone" dataKey="value" stroke="#58c4dd" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

- [ ] **Step 3: Add dashboard view**

```tsx
// components/dashboard/dashboard-view.tsx
"use client";

import { useMarketData } from "@/hooks/use-market-data";
import { fallbackHistory } from "@/lib/api/fallback-data";
import { AssetTable } from "@/components/dashboard/asset-table";
import { MarketStatusCard } from "@/components/dashboard/market-status-card";
import { ConverterPanel } from "@/components/converter/converter-panel";
import { MarketLineChart } from "@/components/charts/market-line-chart";
import { Card } from "@/components/ui/card";

export function DashboardView() {
  const { crypto, fiat, status } = useMarketData("USD");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-cyan-300">Live market dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">RateScope</h1>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        <MarketStatusCard status={status} />
        <Card><p className="text-sm text-slate-400">Tracked crypto</p><p className="mt-2 text-3xl font-semibold">{crypto.length}</p></Card>
        <Card><p className="text-sm text-slate-400">Tracked fiat</p><p className="mt-2 text-3xl font-semibold">{fiat.length}</p></Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <MarketLineChart data={fallbackHistory} />
        <ConverterPanel />
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Crypto markets</h2>
        <AssetTable assets={crypto} />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Fiat rates</h2>
        <AssetTable assets={fiat} />
      </section>
    </div>
  );
}
```

```tsx
// app/page.tsx
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default function DashboardPage() {
  return <DashboardView />;
}
```

- [ ] **Step 4: Add simple pages for remaining routes**

```tsx
// app/converter/page.tsx
import { ConverterPanel } from "@/components/converter/converter-panel";

export default function ConverterPage() {
  return <ConverterPanel />;
}
```

```tsx
// app/markets/page.tsx
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default function MarketsPage() {
  return <DashboardView />;
}
```

```tsx
// app/watchlist/page.tsx
export default function WatchlistPage() {
  return <div><h1 className="text-3xl font-semibold">Watchlist</h1><p className="mt-2 text-slate-400">Favorite pairs will appear here.</p></div>;
}
```

```tsx
// app/alerts/page.tsx
export default function AlertsPage() {
  return <div><h1 className="text-3xl font-semibold">Alerts</h1><p className="mt-2 text-slate-400">Local price alerts will appear here.</p></div>;
}
```

```tsx
// app/settings/page.tsx
export default function SettingsPage() {
  return <div><h1 className="text-3xl font-semibold">Settings</h1><p className="mt-2 text-slate-400">Base currency, theme, refresh intervals, and number formatting.</p></div>;
}
```

```tsx
// app/asset/[symbol]/page.tsx
export default function AssetDetailPage({ params }: { params: { symbol: string } }) {
  return <div><h1 className="text-3xl font-semibold">{params.symbol.toUpperCase()}</h1><p className="mt-2 text-slate-400">Asset details and chart.</p></div>;
}
```

- [ ] **Step 5: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app components
git commit -m "feat: build RateScope dashboard UI"
```

---

### Task 8: Final Verification

**Files:**
- Modify as needed only to fix failures found during verification.

- [ ] **Step 1: Run tests**

Run: `npm run test`

Expected: all tests PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: build completes successfully.

- [ ] **Step 3: Run development server**

Run: `npm run dev`

Expected: local dev server starts, usually on `http://localhost:3000`.

- [ ] **Step 4: Browser verification**

Open `http://localhost:3000` and verify:

- Dashboard loads.
- API status card appears.
- Crypto and fiat tables render live or fallback data.
- Converter widget calculates output.
- Chart renders and is not blank.
- Sidebar navigation works.
- Mobile viewport remains readable.

- [ ] **Step 5: Commit final fixes**

```bash
git add .
git commit -m "chore: verify RateScope MVP"
```

