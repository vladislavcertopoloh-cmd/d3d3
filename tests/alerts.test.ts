import { describe, expect, it } from "vitest";
import { shouldTriggerAlert } from "@/hooks/use-alert-engine";

describe("shouldTriggerAlert", () => {
  it("triggers above alerts", () => {
    expect(shouldTriggerAlert({ condition: "above", targetPrice: 100 }, 101)).toBe(true);
  });

  it("triggers below alerts", () => {
    expect(shouldTriggerAlert({ condition: "below", targetPrice: 100 }, 99)).toBe(true);
  });
});
