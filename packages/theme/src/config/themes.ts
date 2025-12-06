/**
 * Theme Configuration System
 *
 * This file defines all available themes for the application.
 * Each theme exports CSS custom properties that Tailwind consumes.
 */

export type ThemeName =
  | "dark-glassy"
  | "cyber-neon"
  | "midnight"
  | "dracula"
  | "monokai-dark"
  | "night-owl"
  | "synthwave-84"
  | "tokyo-night"
  | "sublime-material"
  | "cyberpunk-2077"
  | "blade-runner";

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

/**
 * Dracula Theme - Popular dark theme with purples and pinks
 *
 * Features:
 * - Dark background with purple tones
 * - Pink and purple accents
 * - Comfortable for extended coding sessions
 */
export const draculaTheme: ThemeColors = {
  background: "231 15% 18%", // Dark purple #282a36
  foreground: "60 30% 96%", // Off-white #f8f8f2

  card: "231 15% 22%",
  cardForeground: "60 30% 96%",
  popover: "231 15% 24%",
  popoverForeground: "60 30% 96%",

  primary: "265 89% 78%", // Dracula purple #bd93f9
  primaryForeground: "231 15% 18%",

  secondary: "331 73% 70%", // Dracula pink #ff79c6
  secondaryForeground: "231 15% 18%",

  muted: "231 15% 35%",
  mutedForeground: "60 30% 85%",

  accent: "48 100% 66%", // Dracula yellow #f1fa8c
  accentForeground: "231 15% 18%",

  destructive: "0 100% 67%", // Dracula red #ff5555
  destructiveForeground: "231 15% 18%",

  border: "231 15% 28%",
  input: "231 15% 24%",
  ring: "265 89% 78%",

  glass: "231 15% 24%",
  glassLight: "231 15% 30%",
  glassDark: "231 15% 20%",

  glowPrimary: "265 89% 78%",
  glowSecondary: "331 73% 70%",
  glowAccent: "48 100% 66%",
};

/**
 * Monokai Dark Theme - Classic code editor theme
 *
 * Features:
 * - Black background
 * - Vibrant, contrasting colors
 * - Popular among developers
 */
export const monokaiDarkTheme: ThemeColors = {
  background: "0 0% 9%", // Monokai black #272822
  foreground: "80 1% 93%", // Monokai white #f8f8f2

  card: "0 0% 15%",
  cardForeground: "80 1% 93%",
  popover: "0 0% 17%",
  popoverForeground: "80 1% 93%",

  primary: "180 100% 42%", // Monokai blue #66d9ef
  primaryForeground: "0 0% 9%",

  secondary: "290 100% 71%", // Monokai magenta #f92672
  secondaryForeground: "0 0% 9%",

  muted: "0 0% 30%",
  mutedForeground: "80 1% 80%",

  accent: "60 100% 50%", // Monokai green #a6e22e
  accentForeground: "0 0% 9%",

  destructive: "0 100% 60%", // Bright red
  destructiveForeground: "0 0% 9%",

  border: "0 0% 25%",
  input: "0 0% 18%",
  ring: "180 100% 42%",

  glass: "0 0% 18%",
  glassLight: "0 0% 25%",
  glassDark: "0 0% 12%",

  glowPrimary: "180 100% 42%",
  glowSecondary: "290 100% 71%",
  glowAccent: "60 100% 50%",
};

/**
 * Night Owl Theme - Popular VS Code theme with blues and purples
 *
 * Features:
 * - Deep blue/purple background
 * - Soft, warm accents
 * - Designed for late night coding
 */
export const nightOwlTheme: ThemeColors = {
  background: "212 21% 14%", // Night owl dark blue #011627
  foreground: "220 13% 91%", // Night owl off-white #d6deeb

  card: "212 21% 18%",
  cardForeground: "220 13% 91%",
  popover: "212 21% 20%",
  popoverForeground: "220 13% 91%",

  primary: "198 100% 50%", // Night owl cyan #0ac5c9
  primaryForeground: "212 21% 14%",

  secondary: "264 67% 68%", // Night owl purple #c792ea
  secondaryForeground: "212 21% 14%",

  muted: "212 21% 30%",
  mutedForeground: "220 13% 75%",

  accent: "47 100% 67%", // Night owl yellow #f6d5a8
  accentForeground: "212 21% 14%",

  destructive: "3 100% 61%", // Night owl red #ff5874
  destructiveForeground: "212 21% 14%",

  border: "212 21% 24%",
  input: "212 21% 20%",
  ring: "198 100% 50%",

  glass: "212 21% 20%",
  glassLight: "212 21% 28%",
  glassDark: "212 21% 16%",

  glowPrimary: "198 100% 50%",
  glowSecondary: "264 67% 68%",
  glowAccent: "47 100% 67%",
};

/**
 * Synthwave '84 Theme - Retro 80s aesthetic with neon colors
 *
 * Features:
 * - Dark background with purple/pink tones
 * - Bright neon colors
 * - Retro synthwave vibe
 */
export const synthwave84Theme: ThemeColors = {
  background: "280 40% 15%", // Dark purple #2a0845
  foreground: "0 0% 100%", // Pure white

  card: "280 40% 20%",
  cardForeground: "0 0% 100%",
  popover: "280 40% 22%",
  popoverForeground: "0 0% 100%",

  primary: "300 100% 60%", // Hot magenta #ff006e
  primaryForeground: "280 40% 15%",

  secondary: "182 100% 50%", // Cyan #00f0ff
  secondaryForeground: "280 40% 15%",

  muted: "280 40% 35%",
  mutedForeground: "0 0% 85%",

  accent: "72 100% 50%", // Neon lime #72f900
  accentForeground: "280 40% 15%",

  destructive: "12 100% 55%", // Orange red
  destructiveForeground: "280 40% 15%",

  border: "280 40% 28%",
  input: "280 40% 22%",
  ring: "300 100% 60%",

  glass: "280 40% 22%",
  glassLight: "280 40% 30%",
  glassDark: "280 40% 18%",

  glowPrimary: "300 100% 60%",
  glowSecondary: "182 100% 50%",
  glowAccent: "72 100% 50%",
};

/**
 * Tokyo Night Theme - Beautiful Japanese-inspired dark theme
 *
 * Features:
 * - Deep blue background
 * - Soft, complementary colors
 * - Elegant and refined
 */
export const tokyoNightTheme: ThemeColors = {
  background: "210 16% 15%", // Tokyo night dark blue #1a1b26
  foreground: "220 13% 91%", // Tokyo night off-white #c0caf5

  card: "210 16% 19%",
  cardForeground: "220 13% 91%",
  popover: "210 16% 21%",
  popoverForeground: "220 13% 91%",

  primary: "200 100% 62%", // Tokyo night blue #7aa2f7
  primaryForeground: "210 16% 15%",

  secondary: "280 74% 65%", // Tokyo night magenta #bb9af7
  secondaryForeground: "210 16% 15%",

  muted: "210 16% 30%",
  mutedForeground: "220 13% 75%",

  accent: "41 92% 62%", // Tokyo night yellow #e0af68
  accentForeground: "210 16% 15%",

  destructive: "0 100% 67%", // Tokyo night red #f7768e
  destructiveForeground: "210 16% 15%",

  border: "210 16% 25%",
  input: "210 16% 21%",
  ring: "200 100% 62%",

  glass: "210 16% 21%",
  glassLight: "210 16% 28%",
  glassDark: "210 16% 17%",

  glowPrimary: "200 100% 62%",
  glowSecondary: "280 74% 65%",
  glowAccent: "41 92% 62%",
};

/**
 * Sublime Material Theme - Material Design inspired
 *
 * Features:
 * - Dark slate background
 * - Material design colors
 * - Professional and polished
 */
export const sublimeMaterialTheme: ThemeColors = {
  background: "200 26% 15%", // Material dark blue #212121
  foreground: "0 0% 95%", // Material off-white #eeffff

  card: "200 26% 19%",
  cardForeground: "0 0% 95%",
  popover: "200 26% 21%",
  popoverForeground: "0 0% 95%",

  primary: "200 100% 50%", // Material cyan #80deea
  primaryForeground: "200 26% 15%",

  secondary: "260 100% 65%", // Material purple #c792ea
  secondaryForeground: "200 26% 15%",

  muted: "200 26% 30%",
  mutedForeground: "0 0% 80%",

  accent: "45 100% 55%", // Material amber #ffb74d
  accentForeground: "200 26% 15%",

  destructive: "0 100% 60%", // Material red
  destructiveForeground: "200 26% 15%",

  border: "200 26% 25%",
  input: "200 26% 21%",
  ring: "200 100% 50%",

  glass: "200 26% 21%",
  glassLight: "200 26% 28%",
  glassDark: "200 26% 17%",

  glowPrimary: "200 100% 50%",
  glowSecondary: "260 100% 65%",
  glowAccent: "45 100% 55%",
};

/**
 * Cyberpunk 2077 Theme - High contrast neon theme inspired by the game
 *
 * Features:
 * - Black background
 * - Bright neon pink and cyan
 * - Maximum contrast for cyberpunk aesthetic
 */
export const cyberpunk2077Theme: ThemeColors = {
  background: "0 0% 0%", // Pure black
  foreground: "0 0% 100%", // Pure white

  card: "320 5% 8%",
  cardForeground: "0 0% 100%",
  popover: "320 5% 10%",
  popoverForeground: "0 0% 100%",

  primary: "300 100% 50%", // Cyberpunk pink #ff00ff
  primaryForeground: "0 0% 0%",

  secondary: "180 100% 50%", // Cyberpunk cyan #00ffff
  secondaryForeground: "0 0% 0%",

  muted: "320 5% 20%",
  mutedForeground: "0 0% 80%",

  accent: "60 100% 50%", // Neon yellow #ffff00
  accentForeground: "0 0% 0%",

  destructive: "0 100% 50%", // Bright red #ff0000
  destructiveForeground: "0 0% 0%",

  border: "320 5% 25%",
  input: "320 5% 12%",
  ring: "300 100% 50%",

  glass: "320 5% 12%",
  glassLight: "320 5% 20%",
  glassDark: "320 5% 8%",

  glowPrimary: "300 100% 50%",
  glowSecondary: "180 100% 50%",
  glowAccent: "60 100% 50%",
};

/**
 * Blade Runner Theme - Retro futuristic theme inspired by Blade Runner
 *
 * Features:
 * - Dark with green and amber tones
 * - Retro-futuristic aesthetic
 * - CRT monitor inspired
 */
export const bladeRunnerTheme: ThemeColors = {
  background: "90 40% 8%", // Dark green #0a1a08
  foreground: "90 100% 85%", // Bright green #a8ff00

  card: "90 40% 12%",
  cardForeground: "90 100% 85%",
  popover: "90 40% 14%",
  popoverForeground: "90 100% 85%",

  primary: "90 100% 50%", // Bright green #00ff00
  primaryForeground: "90 40% 8%",

  secondary: "40 100% 50%", // Amber #ffaa00
  secondaryForeground: "90 40% 8%",

  muted: "90 40% 25%",
  mutedForeground: "90 100% 70%",

  accent: "40 100% 55%", // Amber accent
  accentForeground: "90 40% 8%",

  destructive: "0 100% 60%", // Red for errors
  destructiveForeground: "90 40% 8%",

  border: "90 40% 20%",
  input: "90 40% 14%",
  ring: "90 100% 50%",

  glass: "90 40% 14%",
  glassLight: "90 40% 22%",
  glassDark: "90 40% 10%",

  glowPrimary: "90 100% 50%",
  glowSecondary: "40 100% 50%",
  glowAccent: "40 100% 55%",
};

export const themes: Record<ThemeName, ThemeColors> = {
  "dark-glassy": darkGlassyTheme,
  "cyber-neon": cyberNeonTheme,
  midnight: midnightTheme,
  dracula: draculaTheme,
  "monokai-dark": monokaiDarkTheme,
  "night-owl": nightOwlTheme,
  "synthwave-84": synthwave84Theme,
  "tokyo-night": tokyoNightTheme,
  "sublime-material": sublimeMaterialTheme,
  "cyberpunk-2077": cyberpunk2077Theme,
  "blade-runner": bladeRunnerTheme,
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
