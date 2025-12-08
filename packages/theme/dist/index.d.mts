import * as react_jsx_runtime from "react/jsx-runtime";

/**
 * Theme Configuration System
 *
 * This file defines all available themes for the application.
 * Each theme exports CSS custom properties that Tailwind consumes.
 */
type ThemeName =
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
interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
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
  border: string;
  input: string;
  ring: string;
  glass: string;
  glassLight: string;
  glassDark: string;
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
declare const darkGlassyTheme: ThemeColors;
/**
 * Cyber Neon Theme - High contrast, cyberpunk vibes
 *
 * Features:
 * - Pure black background
 * - Bright neon colors with high contrast
 * - Bold, energetic aesthetic
 * - Maximum readability
 */
declare const cyberNeonTheme: ThemeColors;
/**
 * Midnight Theme - Deep, sophisticated dark theme
 *
 * Features:
 * - Deep indigo background
 * - Muted but warm color palette
 * - Professional, calm aesthetic
 * - Excellent for extended reading
 */
declare const midnightTheme: ThemeColors;
/**
 * Dracula Theme - Popular dark theme with purples and pinks
 *
 * Features:
 * - Dark background with purple tones
 * - Pink and purple accents
 * - Comfortable for extended coding sessions
 */
declare const draculaTheme: ThemeColors;
/**
 * Monokai Dark Theme - Classic code editor theme
 *
 * Features:
 * - Black background
 * - Vibrant, contrasting colors
 * - Popular among developers
 */
declare const monokaiDarkTheme: ThemeColors;
/**
 * Night Owl Theme - Popular VS Code theme with blues and purples
 *
 * Features:
 * - Deep blue/purple background
 * - Soft, warm accents
 * - Designed for late night coding
 */
declare const nightOwlTheme: ThemeColors;
/**
 * Synthwave '84 Theme - Retro 80s aesthetic with neon colors
 *
 * Features:
 * - Dark background with purple/pink tones
 * - Bright neon colors
 * - Retro synthwave vibe
 */
declare const synthwave84Theme: ThemeColors;
/**
 * Tokyo Night Theme - Beautiful Japanese-inspired dark theme
 *
 * Features:
 * - Deep blue background
 * - Soft, complementary colors
 * - Elegant and refined
 */
declare const tokyoNightTheme: ThemeColors;
/**
 * Sublime Material Theme - Material Design inspired
 *
 * Features:
 * - Dark slate background
 * - Material design colors
 * - Professional and polished
 */
declare const sublimeMaterialTheme: ThemeColors;
/**
 * Cyberpunk 2077 Theme - High contrast neon theme inspired by the game
 *
 * Features:
 * - Black background
 * - Bright neon pink and cyan
 * - Maximum contrast for cyberpunk aesthetic
 */
declare const cyberpunk2077Theme: ThemeColors;
/**
 * Blade Runner Theme - Retro futuristic theme inspired by Blade Runner
 *
 * Features:
 * - Dark with green and amber tones
 * - Retro-futuristic aesthetic
 * - CRT monitor inspired
 */
declare const bladeRunnerTheme: ThemeColors;
declare const themes: Record<ThemeName, ThemeColors>;
/**
 * Convert theme colors to CSS custom properties
 */
declare function themeToCSSVars(theme: ThemeColors): Record<string, string>;
/**
 * Get theme by name
 */
declare function getTheme(name: ThemeName): ThemeColors;

interface ThemeContextValue {
  customTheme: ThemeName;
  setCustomTheme: (theme: ThemeName) => void;
}
declare function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useTheme(): ThemeContextValue;

declare function ThemeSwitcher(): react_jsx_runtime.JSX.Element;

/**
 * Theme Utility Hooks and Helpers
 *
 * Provides convenient utilities for building theme-aware components
 */

/**
 * Get a CSS variable value (for runtime usage)
 *
 * @example
 * const primaryColor = getCSSVar('--primary');
 */
declare function getCSSVar(varName: string): string;
/**
 * Conditionally apply Tailwind classes based on theme
 *
 * @example
 * const bgClass = useThemeClass(
 *   { "dark-glassy": "bg-glass-glow" },
 *   "bg-card"
 * );
 */
declare function useThemeClass(
  themeClasses: Partial<Record<ThemeName, string>>,
  defaultClass?: string,
): string;
/**
 * Predefined glass effect variants
 */
declare const glassVariants: {
  readonly standard: "glass";
  readonly elevated: "glass-elevated";
  readonly glow: "glass-glow";
};
/**
 * Predefined glow effect variants
 */
declare const glowVariants: {
  readonly primary: "glow-primary";
  readonly secondary: "glow-secondary";
  readonly accent: "glow-accent";
  readonly sm: "glow-sm";
  readonly lg: "glow-lg";
};
/**
 * Predefined animation variants
 */
declare const animationVariants: {
  readonly fadeIn: "animate-fade-in";
  readonly in: "animate-in";
  readonly pulse: "animate-glow-pulse";
  readonly float: "animate-float";
};
/**
 * Merge theme classes (useful for component composition)
 *
 * @example
 * const buttonClass = mergeThemeClasses(
 *   "px-4 py-2 rounded-lg",
 *   "bg-primary text-primary-foreground"
 * );
 */
declare function mergeThemeClasses(...classes: (string | undefined)[]): string;
/**
 * Create a themed component wrapper
 *
 * @example
 * const ThemedCard = createThemedComponent({
 *   base: "glass p-6 rounded-xl",
 *   "dark-glassy": "glow-primary"
 * });
 */
declare function createThemedComponent(
  classes: {
    base: string;
  } & Partial<Record<ThemeName, string>>,
): string;

export {
  type ThemeColors,
  type ThemeName,
  ThemeProvider,
  ThemeSwitcher,
  animationVariants,
  bladeRunnerTheme,
  createThemedComponent,
  cyberNeonTheme,
  cyberpunk2077Theme,
  darkGlassyTheme,
  draculaTheme,
  getCSSVar,
  getTheme,
  glassVariants,
  glowVariants,
  mergeThemeClasses,
  midnightTheme,
  monokaiDarkTheme,
  nightOwlTheme,
  sublimeMaterialTheme,
  synthwave84Theme,
  themeToCSSVars,
  themes,
  tokyoNightTheme,
  useTheme,
  useThemeClass,
};
