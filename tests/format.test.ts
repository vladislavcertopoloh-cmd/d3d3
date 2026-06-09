import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent, formatUpdatedTime } from "@/lib/utils/format";

describe("format utilities", () => {
  it("formats compact currency", () => {
    expect(formatCurrency(1234567, "USD", "compact")).toBe("$1.23M");
  });

  it("formats percent with sign", () => {
    expect(formatPercent(2.345)).toBe("+2.35%");
    expect(formatPercent(-1.2)).toBe("-1.20%");
  });

  it("formats updated time from ISO input", () => {
    expect(formatUpdatedTime("2026-06-09T10:30:00.000Z")).toContain("Last updated");
  });
});
