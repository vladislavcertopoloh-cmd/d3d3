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
