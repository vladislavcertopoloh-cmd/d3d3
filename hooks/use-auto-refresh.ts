"use client";

import { useEffect } from "react";

export function useAutoRefresh(callback: () => void, intervalMs: number, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const id = window.setInterval(callback, intervalMs);
    return () => window.clearInterval(id);
  }, [callback, enabled, intervalMs]);
}
