import { NextResponse } from "next/server";
import { getFiatRates } from "@/lib/api/market-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get("base") ?? "USD";

  return NextResponse.json(await getFiatRates(base));
}
