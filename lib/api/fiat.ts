import { normalizeFiatRates } from "@/lib/api/normalizers";

const symbols = "USD,EUR,NOK,CAD,GBP,CHF,PLN,UAH";

export async function fetchFiatRates(base = "USD") {
  const targetSymbols = symbols
    .split(",")
    .filter((symbol) => symbol !== base.toUpperCase())
    .join(",");
  const url = `https://api.frankfurter.app/latest?from=${base}&to=${targetSymbols}`;
  const response = await fetch(url, { next: { revalidate: 600 } });

  if (!response.ok) {
    throw new Error(`Fiat rates failed: ${response.status}`);
  }

  const rows = normalizeFiatRates(await response.json());
  return [
    {
      type: "fiat" as const,
      symbol: base.toUpperCase(),
      name: base.toUpperCase(),
      rateToBase: 1,
      baseCurrency: base.toUpperCase(),
      updatedAt: new Date().toISOString()
    },
    ...rows
  ];
}
