import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getActiveNavHref, isNavItemActive, navigationItems } from "@/lib/utils/navigation";

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

  it("chooses the active sidebar item from the current path", () => {
    expect(getActiveNavHref("/")).toBe("/");
    expect(getActiveNavHref("/markets")).toBe("/markets");
    expect(getActiveNavHref("/markets/btc")).toBe("/markets");
    expect(getActiveNavHref("/unknown")).toBe("/");
  });

  it("points sidebar items to existing app pages", () => {
    for (const item of navigationItems) {
      const pagePath = item.href === "/" ? "app/page.tsx" : `app${item.href}/page.tsx`;
      expect(existsSync(join(process.cwd(), pagePath)), `${item.label} route should exist`).toBe(true);
    }
  });
});
