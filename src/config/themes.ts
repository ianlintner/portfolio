/**
 * Theme Configuration System
 * 
 * This file defines all available themes for the application.
 * Each theme exports CSS custom properties that Tailwind consumes.
 */

export type ThemeName = "dark-glassy";

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
  foreground: "210 40% 98%", // Near white

  // Glass-effect cards - semi-transparent navy with subtle backdrop
  card: "210 40% 8%", // Slightly lighter navy
  cardForeground: "210 40% 98%",
  popover: "210 40% 10%",
  popoverForeground: "210 40% 98%",

  // Primary - Electric blue with glow
  primary: "217 100% 60%", // Vivid cyan-blue #00b4ff
  primaryForeground: "210 40% 4%",

  // Secondary - Muted slate (for subtle UI elements)
  secondary: "215 32% 20%", // Slate with transparency in mind
  secondaryForeground: "210 40% 98%",

  // Muted - For disabled/secondary states
  muted: "215 32% 18%",
  mutedForeground: "210 40% 70%",

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

export const themes: Record<ThemeName, ThemeColors> = {
  "dark-glassy": darkGlassyTheme,
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
