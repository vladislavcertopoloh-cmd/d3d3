import { describe, expect, it } from "vitest";
import { isNavItemActive, navigationItems } from "@/lib/utils/navigation";

describe("navigation", () => {
  it("keeps sidebar links wired to real app routes", () => {
    expect(navigationItems.map((item) => [item.label, item.href])).toEqual([
      ["Dashboard", "/"],
      ["Converter", "/converter"],
      ["Markets", "/markets"],
      ["Watchlist", "/watchlist"],
      ["Alerts", "/alerts"],
      ["Settings", "/settings"]
    ]);
  });

  it("marks the matching section active", () => {
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/", "/converter")).toBe(false);
    expect(isNavItemActive("/markets", "/markets/btc")).toBe(true);
    expect(isNavItemActive("/watchlist", "/watchlist")).toBe(true);
  });
});
