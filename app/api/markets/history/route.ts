import { NextResponse } from "next/server";
import { getHistory } from "@/lib/api/market-data";
import type { ChartRange } from "@/types/market";

const ranges = new Set(["1H", "24H", "7D", "1M", "6M", "1Y"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get("asset") ?? "BTC";
  const currency = searchParams.get("currency") ?? "USD";
  const range = searchParams.get("range") ?? "7D";

  if (!ranges.has(range)) {
    return NextResponse.json({ error: "Unsupported range" }, { status: 400 });
  }

  return NextResponse.json(await getHistory(asset, currency, range as ChartRange));
}
