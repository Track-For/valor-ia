"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "medium" | "low";

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

export function usePerformanceTier() {
  const [tier, setTier] = useState<PerformanceTier>("low");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        setTier("low");
        return;
      }

      const cores = navigator.hardwareConcurrency ?? 4;
      const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;
      const narrow = window.matchMedia("(max-width: 767px)").matches;

      if (cores >= 8 && memory >= 8 && !narrow) {
        setTier("high");
        return;
      }

      if (cores >= 4 && memory >= 4) {
        setTier("medium");
        return;
      }

      setTier("low");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return tier;
}
