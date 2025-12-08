"use client";

import { useState, useEffect } from "react";

/**
 * useMediaQuery Hook
 *
 * Reactive hook that tracks whether a CSS media query matches.
 * SSR-safe with a default value option.
 *
 * @param query - CSS media query string
 * @param defaultValue - Default value for SSR (default: false)
 * @returns Whether the media query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (modern API)
    mediaQuery.addEventListener("change", handler);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint hooks following Tailwind defaults
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 639px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery("(min-width: 1280px)");
}

/**
 * Tailwind breakpoint hooks
 */
export function useBreakpoint(
  breakpoint: "sm" | "md" | "lg" | "xl" | "2xl",
): boolean {
  const breakpoints = {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
  };

  return useMediaQuery(breakpoints[breakpoint]);
}

/**
 * System preference hooks
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

export function usePrefersHighContrast(): boolean {
  return useMediaQuery("(prefers-contrast: high)");
}
