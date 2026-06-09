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
