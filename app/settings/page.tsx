"use client";

import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { AppSettings } from "@/types/market";

const defaults: AppSettings = {
  baseCurrency: "USD",
  theme: "dark",
  cryptoRefreshSeconds: 60,
  fiatRefreshMinutes: 10,
  preferredChartRange: "7D",
  numberFormat: "compact"
};

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>("ratescope:settings", defaults);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <Card className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm text-slate-400">
          Base currency
          <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white" value={settings.baseCurrency} onChange={(event) => setSettings({ ...settings, baseCurrency: event.target.value as AppSettings["baseCurrency"] })}>
            {["USD", "EUR", "NOK", "CAD", "UAH"].map((currency) => <option key={currency}>{currency}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-slate-400">
          Theme
          <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white" value={settings.theme} onChange={(event) => setSettings({ ...settings, theme: event.target.value as AppSettings["theme"] })}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm text-slate-400">
          Crypto refresh seconds
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white" type="number" value={settings.cryptoRefreshSeconds} onChange={(event) => setSettings({ ...settings, cryptoRefreshSeconds: Number(event.target.value) })} />
        </label>
        <label className="grid gap-1 text-sm text-slate-400">
          Fiat refresh minutes
          <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white" type="number" value={settings.fiatRefreshMinutes} onChange={(event) => setSettings({ ...settings, fiatRefreshMinutes: Number(event.target.value) })} />
        </label>
        <label className="grid gap-1 text-sm text-slate-400">
          Preferred chart range
          <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white" value={settings.preferredChartRange} onChange={(event) => setSettings({ ...settings, preferredChartRange: event.target.value as AppSettings["preferredChartRange"] })}>
            {["1H", "24H", "7D", "1M", "6M", "1Y"].map((range) => <option key={range}>{range}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-slate-400">
          Number formatting
          <select className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white" value={settings.numberFormat} onChange={(event) => setSettings({ ...settings, numberFormat: event.target.value as AppSettings["numberFormat"] })}>
            <option value="compact">Compact</option>
            <option value="standard">Standard</option>
          </select>
        </label>
        <button className="rounded-md border border-rose-300/30 px-4 py-2 text-sm text-rose-200 hover:bg-rose-400/10 md:col-span-2" onClick={() => setSettings(defaults)}>
          Reset local settings
        </button>
      </Card>
    </div>
  );
}
