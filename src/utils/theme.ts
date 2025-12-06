/**
 * Theme Utility Hooks and Helpers
 *
 * Provides convenient utilities for building theme-aware components
 */

import { useTheme } from "@/components/ThemeProvider";
import type { ThemeName } from "@/config/themes";

/**
 * Get a CSS variable value (for runtime usage)
 *
 * @example
 * const primaryColor = getCSSVar('--primary');
 */
export function getCSSVar(varName: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

/**
 * Conditionally apply Tailwind classes based on theme
 *
 * @example
 * const bgClass = useThemeClass(
 *   { "dark-glassy": "bg-glass-glow" },
 *   "bg-card"
 * );
 */
export function useThemeClass(
  themeClasses: Partial<Record<ThemeName, string>>,
  defaultClass = "",
): string {
  const { customTheme } = useTheme();
  return themeClasses[customTheme] ?? defaultClass;
}

/**
 * Predefined glass effect variants
 */
export const glassVariants = {
  standard: "glass",
  elevated: "glass-elevated",
  glow: "glass-glow",
} as const;

/**
 * Predefined glow effect variants
 */
export const glowVariants = {
  primary: "glow-primary",
  secondary: "glow-secondary",
  accent: "glow-accent",
  sm: "glow-sm",
  lg: "glow-lg",
} as const;

/**
 * Predefined animation variants
 */
export const animationVariants = {
  fadeIn: "animate-fade-in",
  in: "animate-in",
  pulse: "animate-glow-pulse",
  float: "animate-float",
} as const;

/**
 * Merge theme classes (useful for component composition)
 *
 * @example
 * const buttonClass = mergeThemeClasses(
 *   "px-4 py-2 rounded-lg",
 *   "bg-primary text-primary-foreground"
 * );
 */
export function mergeThemeClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Create a themed component wrapper
 *
 * @example
 * const ThemedCard = createThemedComponent({
 *   base: "glass p-6 rounded-xl",
 *   "dark-glassy": "glow-primary"
 * });
 */
export function createThemedComponent(
  classes: {
    base: string;
  } & Partial<Record<ThemeName, string>>,
): string {
  // This is a static helper - use useThemeClass hook in components
  return classes.base;
}
