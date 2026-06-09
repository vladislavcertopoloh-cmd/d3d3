export function shouldTriggerAlert(alert: { condition: "above" | "below"; targetPrice: number }, currentPrice: number) {
  return alert.condition === "above" ? currentPrice >= alert.targetPrice : currentPrice <= alert.targetPrice;
}
