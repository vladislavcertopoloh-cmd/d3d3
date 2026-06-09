import { NextResponse } from "next/server";
import { getCryptoMarkets } from "@/lib/api/market-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency") ?? "USD";

  return NextResponse.json(await getCryptoMarkets(currency));
}
