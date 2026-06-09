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
