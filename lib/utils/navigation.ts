export const navigationItems = [
  { href: "/", label: "Dashboard", icon: "Activity" },
  { href: "/converter", label: "Converter", icon: "Calculator" },
  { href: "/markets", label: "Markets", icon: "LineChart" },
  { href: "/watchlist", label: "Watchlist", icon: "Star" },
  { href: "/alerts", label: "Alerts", icon: "Bell" },
  { href: "/settings", label: "Settings", icon: "Settings" }
] as const;

export type NavigationHref = (typeof navigationItems)[number]["href"];

export function isNavItemActive(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveNavHref(pathname: string) {
  return [...navigationItems]
    .sort((left, right) => right.href.length - left.href.length)
    .find((item) => isNavItemActive(item.href, pathname))?.href ?? "/";
}
