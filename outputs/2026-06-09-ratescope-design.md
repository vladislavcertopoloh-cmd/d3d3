# RateScope Design Spec

## Purpose

RateScope is a modern real-time fintech dashboard for tracking fiat exchange rates, cryptocurrency prices, historical charts, conversions, watchlists, and local price alerts.

The app must feel like a polished financial product rather than a basic demo. It should show fresh market data, clear loading and error states, and a responsive interface that works well on desktop and mobile.

RateScope does not require AI features.

## First Version Scope

The MVP includes:

- Next.js web application with React, TypeScript, and Tailwind CSS.
- Dark fintech UI by default with light/system theme option.
- Real-time dashboard for selected fiat currencies and cryptocurrencies.
- Public API integration for live market data.
- Auto-refresh with visible status: Live, Updating, Offline.
- Currency converter for fiat-to-fiat, fiat-to-crypto, crypto-to-fiat, and crypto-to-crypto.
- Historical charts with range controls where the selected public API supports the data.
- Asset detail pages for fiat and crypto.
- Global search with `Ctrl+K`.
- Watchlist/favorites stored in `localStorage`.
- Basic local price alerts stored in `localStorage`.
- Settings stored in `localStorage`.
- Loading, empty, rate-limit, offline, and error states.
- Fallback/mock data when public APIs fail during development or temporary outages.

The MVP excludes:

- Authentication.
- User accounts.
- SQLite or hosted database.
- Payment features.
- Real financial news scraping.
- Portfolio simulator.
- CSV export.
- PWA install support.
- Advanced heatmaps and compare mode.

These excluded features are planned as later phases after the live dashboard MVP is stable.

## Architecture

RateScope uses the Next.js App Router with a clean separation between UI, API routes, market data services, reusable hooks, utilities, and shared types.

External API calls should not be scattered through UI components. UI components read normalized app data from hooks and API routes. API routes call service modules in `lib/api`, normalize external responses, handle rate limits and failures, and return consistent JSON shapes to the frontend.

Persistent user preferences are local-only in the MVP. Watchlist, recent conversions, alerts, theme, base currency, preferred chart range, refresh intervals, and number formatting settings are stored in `localStorage`.

## Technology Stack

```text
Frontend: React + TypeScript
Framework: Next.js
Styling: Tailwind CSS
Charts: Recharts or TradingView Lightweight Charts
API layer: Next.js API routes
Local persistence: localStorage
```

Recommended chart choice for MVP: Recharts. It is simpler to integrate for dashboard cards and line charts. TradingView Lightweight Charts can be considered later if the product needs a more trading-terminal feel.

## Project Structure

```text
app/
  api/
  asset/[symbol]/
  alerts/
  converter/
  markets/
  settings/
  watchlist/
components/
  charts/
  converter/
  dashboard/
  layout/
  markets/
  search/
  ui/
hooks/
lib/
  api/
  utils/
store/
types/
```

Responsibilities:

- `app/` contains routes, pages, layouts, and Next.js API routes.
- `components/dashboard/` contains market overview, movers, tables, status widgets, and dashboard sections.
- `components/converter/` contains the converter form, result panel, fee simulation, and recent conversions.
- `components/charts/` contains line charts, range selector, tooltip formatting, and chart empty/error states.
- `components/search/` contains global search and command palette behavior.
- `components/ui/` contains reusable buttons, cards, badges, inputs, skeletons, tabs, dialogs, and banners.
- `hooks/` contains auto-refresh, localStorage state, search shortcut, market data loading, and alert evaluation hooks.
- `lib/api/` contains external API clients, normalizers, cache helpers, and fallback data.
- `lib/utils/` contains formatting, percentage calculations, range helpers, sorting, and type guards.
- `store/` contains lightweight client state if needed.
- `types/` contains shared TypeScript interfaces.

## Data Sources

Crypto data:

- Primary public API: CoinGecko.
- Required data: current price, 24h change, 7d change where available, market cap, volume, circulating supply where available, and historical price points.

Fiat data:

- Primary public API: Frankfurter API or another free exchange-rate API.
- Required currencies: USD, EUR, NOK, CAD, GBP, CHF, PLN, UAH.
- Required data: latest exchange rate, last updated time, and historical data where supported.

The API service layer must be written so providers can be replaced without changing UI components.

## Refresh Behavior

Refresh intervals:

- Crypto prices: every 30-60 seconds.
- Fiat rates: every 5-15 minutes.
- Historical charts: refresh when asset, quote currency, or range changes, and periodically only if useful for short ranges.

Each data section should show:

- Last updated time.
- Live, Updating, Offline, or Rate Limited status.
- Friendly error state when data cannot be refreshed.
- Last known data when available.

## API Routes

MVP API routes:

```text
GET /api/markets/fiat
GET /api/markets/crypto
GET /api/markets/history?asset=BTC&currency=USD&range=7D
GET /api/convert?from=BTC&to=NOK&amount=1&fee=1
```

Optional route if it keeps components cleaner:

```text
GET /api/search?q=btc
```

API route behavior:

- Validate query parameters.
- Return normalized data.
- Handle provider failures.
- Return cached or fallback data when reasonable.
- Never expose secret keys in frontend code.
- Avoid hardcoding API responses inside UI components.

## Core Types

```ts
export type AssetType = "fiat" | "crypto";

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

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
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
  state: "live" | "updating" | "offline" | "rate_limited";
  lastUpdated?: string;
  message?: string;
}

export interface AppSettings {
  baseCurrency: "USD" | "EUR" | "NOK" | "CAD" | "UAH";
  theme: "dark" | "light" | "system";
  cryptoRefreshSeconds: number;
  fiatRefreshMinutes: number;
  preferredChartRange: "1H" | "24H" | "7D" | "1M" | "6M" | "1Y";
  numberFormat: "compact" | "standard";
}
```

## Pages

### Dashboard

The dashboard is the first screen. It includes:

- Header with global search and theme switcher.
- Market overview cards.
- Favorites/watchlist section at the top.
- Top crypto movers.
- Fiat exchange table.
- Crypto market table.
- Converter widget.
- Historical chart widget.
- Last updated and API status indicators.

### Converter

The converter supports:

- Fiat to fiat.
- Fiat to crypto.
- Crypto to fiat.
- Crypto to crypto.
- Amount input.
- From and To asset selectors.
- Automatic result updates.
- Reverse rate.
- Fee simulation: 0%, 1%, 2%, custom.
- Recent conversions stored locally.

### Markets

Markets shows full fiat and crypto lists with:

- Search.
- Type filters.
- Sorting by symbol, name, price, 24h change, 7d change, and market cap where available.
- Click-through to asset detail pages.

### Asset Detail

Fiat detail page shows:

- Current exchange rate against selected base currency.
- Historical chart.
- Change over selected range when available.
- Related conversion pairs.

Crypto detail page shows:

- Current price.
- 24h and 7d change.
- Market cap.
- Volume.
- Circulating supply.
- Historical chart.
- Placeholder links section.

### Watchlist

Watchlist lets users favorite assets and pairs such as:

```text
BTC/USD
ETH/NOK
CAD/NOK
EUR/UAH
```

Favorites appear at the top of the dashboard and are stored in `localStorage`.

### Alerts

Alerts are local-only in MVP. A user selects an asset or pair, sets a target price, and chooses above or below. When live data crosses the condition, the app shows a notification banner.

### Settings

Settings includes:

- Default base currency: USD, EUR, NOK, CAD, UAH.
- Theme: dark, light, system.
- Crypto and fiat refresh interval settings.
- Clear local data.
- Preferred chart range.
- Number formatting option.

## Search

Global search opens with `Ctrl+K`.

Search supports:

- Currency code.
- Crypto symbol.
- Asset name.
- Type label: fiat or crypto.

Results show icon, symbol, name, type, and click-through destination.

## Historical Charts

Supported ranges:

```text
1H
24H
7D
1M
6M
1Y
```

The chart component should show:

- Smooth line chart.
- Tooltip with date and value.
- Percentage change for selected range.
- High and low for selected range.
- Loading skeleton.
- Empty state.
- Error state.

If an API does not support a range for a specific asset type, the UI should disable that range or show a clear unavailable state.

## UI Direction

RateScope should look like a premium fintech dashboard:

- Dark theme by default.
- Light/system theme option.
- Clean sidebar navigation.
- Responsive layout for desktop and mobile.
- Beautiful asset cards.
- Green/red change indicators.
- Professional typography.
- Smooth hover effects.
- Skeleton loading states.
- Empty states.
- Error states.
- Mobile-friendly tables and card layouts.

Glassmorphism can be used subtly on cards, but readability and contrast matter more than decoration. The app should feel calm, dense, and useful.

## Error Handling

The app must handle:

- Public API downtime.
- Rate limits.
- Network failures.
- Missing historical data for a selected range.
- Invalid converter amounts.
- Unsupported conversion pairs.
- Empty watchlist.
- Alerts with invalid target prices.
- LocalStorage read/write failures.

When live API data fails, the UI should keep the last known data if available and clearly mark the status as offline or rate-limited.

## Testing Strategy

Implementation should include focused tests for:

- Formatting utilities.
- Conversion calculations.
- Fee simulation.
- API response normalization.
- Range statistics: percentage change, high, low.
- Watchlist localStorage behavior.
- Alert trigger logic.

Manual verification should cover:

- Dashboard loads with live or fallback data.
- Auto-refresh updates status and timestamps.
- Converter handles fiat/crypto combinations.
- Search opens with `Ctrl+K`.
- Watchlist add/remove works and persists.
- Alert banner appears when a condition is met.
- Settings persist after reload.
- Mobile layout remains usable.
- Error and loading states are visible and polished.

## Later Phases

After the MVP works, planned extensions are:

- Crypto market heatmap.
- Mini sparkline charts on asset cards.
- Compare mode for multiple assets on one chart.
- Portfolio simulator without real-money trading.
- Currency strength index.
- Offline cache for last known prices.
- Export watchlist to CSV.
- Shareable conversion result links.
- PWA support.
- Optional public financial news API integration.
