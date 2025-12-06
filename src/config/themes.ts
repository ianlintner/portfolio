/**
 * Theme Configuration System
 *
 * This file defines all available themes for the application.
 * Each theme exports CSS custom properties that Tailwind consumes.
 */

export type ThemeName = "dark-glassy" | "cyber-neon" | "midnight";

export interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;

  // Card & surface
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  // Semantic colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;

  // Borders & inputs
  border: string;
  input: string;
  ring: string;

  // Glass effect colors (semi-transparent overlays)
  glass: string;
  glassLight: string;
  glassDark: string;

  // Glow effect colors
  glowPrimary: string;
  glowSecondary: string;
  glowAccent: string;
}

/**
 * Dark Glassy Theme - Modern 2025 Design
 *
 * Features:
 * - Deep navy/slate base for contrast
 * - Frosted glass effect (backdrop blur + semi-transparent)
 * - Subtle glows and gradients
 * - Minimal yet sophisticated
 * - Optimized for readability and modern aesthetics
 */
export const darkGlassyTheme: ThemeColors = {
  // Deep navy base with high contrast
  background: "210 40% 4%", // Deep navy #0a0e27
  foreground: "210 10% 95%", // Brighter near-white for better contrast

  // Glass-effect cards - semi-transparent navy with subtle backdrop
  card: "210 40% 8%", // Slightly lighter navy
  cardForeground: "210 10% 95%",
  popover: "210 40% 10%",
  popoverForeground: "210 10% 95%",

  // Primary - Electric blue with glow
  primary: "217 100% 60%", // Vivid cyan-blue #00b4ff
  primaryForeground: "210 40% 4%",

  // Secondary - Muted slate (for subtle UI elements)
  secondary: "215 32% 20%", // Slate with transparency in mind
  secondaryForeground: "210 10% 95%",

  // Muted - For disabled/secondary states
  muted: "215 32% 18%",
  mutedForeground: "210 10% 75%", // Brighter muted text

  // Accent - Vibrant purple glow
  accent: "270 100% 60%", // Purple #b300ff
  accentForeground: "210 40% 4%",

  // Destructive
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "210 40% 98%",

  // Borders & inputs
  border: "215 32% 18%",
  input: "215 32% 16%",
  ring: "217 100% 60%", // Primary blue

  // Glass effect - for layered UI elements
  glass: "210 40% 15%", // Opaque navy for darker glass
  glassLight: "210 40% 20%", // Lighter glass
  glassDark: "210 40% 8%", // Darker glass

  // Glow colors (used in shadows/glows)
  glowPrimary: "217 100% 60%", // Electric blue
  glowSecondary: "270 100% 60%", // Purple
  glowAccent: "190 100% 50%", // Cyan
};

/**
 * Cyber Neon Theme - High contrast, cyberpunk vibes
 *
 * Features:
 * - Pure black background
 * - Bright neon colors with high contrast
 * - Bold, energetic aesthetic
 * - Maximum readability
 */
export const cyberNeonTheme: ThemeColors = {
  // Pure black base
  background: "0 0% 0%", // Pure black
  foreground: "0 0% 100%", // Pure white

  // Glass-effect cards - very dark with neon accent
  card: "240 10% 10%", // Very dark blue-gray
  cardForeground: "0 0% 100%",
  popover: "240 10% 12%",
  popoverForeground: "0 0% 100%",

  // Primary - Bright cyan
  primary: "180 100% 50%", // Bright cyan
  primaryForeground: "0 0% 0%",

  // Secondary - Neon pink
  secondary: "320 100% 50%", // Neon pink
  secondaryForeground: "0 0% 0%",

  // Muted - Dark gray
  muted: "240 10% 20%",
  mutedForeground: "0 0% 80%",

  // Accent - Neon green
  accent: "120 100% 50%", // Neon green
  accentForeground: "0 0% 0%",

  // Destructive - Bright red
  destructive: "0 100% 50%",
  destructiveForeground: "0 0% 0%",

  // Borders & inputs
  border: "240 10% 25%",
  input: "240 10% 15%",
  ring: "180 100% 50%", // Bright cyan

  // Glass effect
  glass: "240 10% 15%",
  glassLight: "240 10% 25%",
  glassDark: "240 10% 10%",

  // Glow colors
  glowPrimary: "180 100% 50%", // Cyan
  glowSecondary: "320 100% 50%", // Pink
  glowAccent: "120 100% 50%", // Green
};

/**
 * Midnight Theme - Deep, sophisticated dark theme
 *
 * Features:
 * - Deep indigo background
 * - Muted but warm color palette
 * - Professional, calm aesthetic
 * - Excellent for extended reading
 */
export const midnightTheme: ThemeColors = {
  // Deep indigo base
  background: "250 25% 8%", // Deep indigo #1a1a33
  foreground: "210 15% 92%", // Soft off-white

  // Glass-effect cards
  card: "250 25% 12%", // Slightly lighter indigo
  cardForeground: "210 15% 92%",
  popover: "250 25% 14%",
  popoverForeground: "210 15% 92%",

  // Primary - Warm amber
  primary: "45 100% 55%", // Warm amber/gold
  primaryForeground: "250 25% 8%",

  // Secondary - Soft purple
  secondary: "270 50% 45%", // Soft purple
  secondaryForeground: "210 15% 92%",

  // Muted - Muted blue
  muted: "250 20% 25%",
  mutedForeground: "210 15% 75%",

  // Accent - Teal
  accent: "180 60% 50%", // Teal
  accentForeground: "250 25% 8%",

  // Destructive
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "250 25% 8%",

  // Borders & inputs
  border: "250 20% 20%",
  input: "250 20% 15%",
  ring: "45 100% 55%", // Amber

  // Glass effect
  glass: "250 25% 18%",
  glassLight: "250 25% 25%",
  glassDark: "250 25% 12%",

  // Glow colors
  glowPrimary: "45 100% 55%", // Amber
  glowSecondary: "270 50% 45%", // Purple
  glowAccent: "180 60% 50%", // Teal
};

export const themes: Record<ThemeName, ThemeColors> = {
  "dark-glassy": darkGlassyTheme,
  "cyber-neon": cyberNeonTheme,
  "midnight": midnightTheme,
};

/**
 * Convert theme colors to CSS custom properties
 */
export function themeToCSSVars(theme: ThemeColors): Record<string, string> {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--card": theme.card,
    "--card-foreground": theme.cardForeground,
    "--popover": theme.popover,
    "--popover-foreground": theme.popoverForeground,
    "--primary": theme.primary,
    "--primary-foreground": theme.primaryForeground,
    "--secondary": theme.secondary,
    "--secondary-foreground": theme.secondaryForeground,
    "--muted": theme.muted,
    "--muted-foreground": theme.mutedForeground,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--destructive": theme.destructive,
    "--destructive-foreground": theme.destructiveForeground,
    "--border": theme.border,
    "--input": theme.input,
    "--ring": theme.ring,
    "--glass": theme.glass,
    "--glass-light": theme.glassLight,
    "--glass-dark": theme.glassDark,
    "--glow-primary": theme.glowPrimary,
    "--glow-secondary": theme.glowSecondary,
    "--glow-accent": theme.glowAccent,
  };
}

/**
 * Get theme by name
 */
export function getTheme(name: ThemeName): ThemeColors {
  return themes[name];
}
