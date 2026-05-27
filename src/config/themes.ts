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

export const darkGlassyTheme: ThemeColors = {
  background: "210 40% 4%",
  foreground: "210 10% 95%",
  card: "210 40% 8%",
  cardForeground: "210 10% 95%",
  popover: "210 40% 10%",
  popoverForeground: "210 10% 95%",
  primary: "217 100% 60%",
  primaryForeground: "210 40% 4%",
  secondary: "215 32% 20%",
  secondaryForeground: "210 10% 95%",
  muted: "215 32% 18%",
  mutedForeground: "210 10% 75%",
  accent: "270 100% 60%",
  accentForeground: "210 40% 4%",
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "210 40% 98%",
  border: "215 32% 18%",
  input: "215 32% 16%",
  ring: "217 100% 60%",
  glass: "210 40% 15%",
  glassLight: "210 40% 20%",
  glassDark: "210 40% 8%",
  glowPrimary: "217 100% 60%",
  glowSecondary: "270 100% 60%",
  glowAccent: "190 100% 50%",
};

export const cyberNeonTheme: ThemeColors = {
  background: "0 0% 0%",
  foreground: "0 0% 100%",
  card: "240 10% 10%",
  cardForeground: "0 0% 100%",
  popover: "240 10% 12%",
  popoverForeground: "0 0% 100%",
  primary: "180 100% 50%",
  primaryForeground: "0 0% 0%",
  secondary: "320 100% 50%",
  secondaryForeground: "0 0% 0%",
  muted: "240 10% 20%",
  mutedForeground: "0 0% 80%",
  accent: "120 100% 50%",
  accentForeground: "0 0% 0%",
  destructive: "0 100% 50%",
  destructiveForeground: "0 0% 0%",
  border: "240 10% 25%",
  input: "240 10% 15%",
  ring: "180 100% 50%",
  glass: "240 10% 15%",
  glassLight: "240 10% 25%",
  glassDark: "240 10% 10%",
  glowPrimary: "180 100% 50%",
  glowSecondary: "320 100% 50%",
  glowAccent: "120 100% 50%",
};

export const midnightTheme: ThemeColors = {
  background: "250 25% 8%",
  foreground: "210 15% 92%",
  card: "250 25% 12%",
  cardForeground: "210 15% 92%",
  popover: "250 25% 14%",
  popoverForeground: "210 15% 92%",
  primary: "45 100% 55%",
  primaryForeground: "250 25% 8%",
  secondary: "270 50% 45%",
  secondaryForeground: "210 15% 92%",
  muted: "250 20% 25%",
  mutedForeground: "210 15% 75%",
  accent: "180 60% 50%",
  accentForeground: "250 25% 8%",
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "250 25% 8%",
  border: "250 20% 20%",
  input: "250 20% 15%",
  ring: "45 100% 55%",
  glass: "250 25% 18%",
  glassLight: "250 25% 25%",
  glassDark: "250 25% 12%",
  glowPrimary: "45 100% 55%",
  glowSecondary: "270 50% 45%",
  glowAccent: "180 60% 50%",
};

export const draculaTheme: ThemeColors = {
  background: "231 15% 18%",
  foreground: "60 30% 96%",
  card: "231 15% 22%",
  cardForeground: "60 30% 96%",
  popover: "231 15% 24%",
  popoverForeground: "60 30% 96%",
  primary: "265 89% 78%",
  primaryForeground: "231 15% 18%",
  secondary: "331 73% 70%",
  secondaryForeground: "231 15% 18%",
  muted: "231 15% 35%",
  mutedForeground: "60 30% 85%",
  accent: "48 100% 66%",
  accentForeground: "231 15% 18%",
  destructive: "0 100% 67%",
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

export const monokaiDarkTheme: ThemeColors = {
  background: "0 0% 9%",
  foreground: "80 1% 93%",
  card: "0 0% 15%",
  cardForeground: "80 1% 93%",
  popover: "0 0% 17%",
  popoverForeground: "80 1% 93%",
  primary: "180 100% 42%",
  primaryForeground: "0 0% 9%",
  secondary: "290 100% 71%",
  secondaryForeground: "0 0% 9%",
  muted: "0 0% 30%",
  mutedForeground: "80 1% 80%",
  accent: "60 100% 50%",
  accentForeground: "0 0% 9%",
  destructive: "0 100% 60%",
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

export const nightOwlTheme: ThemeColors = {
  background: "212 21% 14%",
  foreground: "220 13% 91%",
  card: "212 21% 18%",
  cardForeground: "220 13% 91%",
  popover: "212 21% 20%",
  popoverForeground: "220 13% 91%",
  primary: "198 100% 50%",
  primaryForeground: "212 21% 14%",
  secondary: "264 67% 68%",
  secondaryForeground: "212 21% 14%",
  muted: "212 21% 30%",
  mutedForeground: "220 13% 75%",
  accent: "47 100% 67%",
  accentForeground: "212 21% 14%",
  destructive: "3 100% 61%",
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

export const synthwave84Theme: ThemeColors = {
  background: "280 40% 15%",
  foreground: "0 0% 100%",
  card: "280 40% 20%",
  cardForeground: "0 0% 100%",
  popover: "280 40% 22%",
  popoverForeground: "0 0% 100%",
  primary: "300 100% 60%",
  primaryForeground: "280 40% 15%",
  secondary: "182 100% 50%",
  secondaryForeground: "280 40% 15%",
  muted: "280 40% 35%",
  mutedForeground: "0 0% 85%",
  accent: "72 100% 50%",
  accentForeground: "280 40% 15%",
  destructive: "12 100% 55%",
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

export const tokyoNightTheme: ThemeColors = {
  background: "210 16% 15%",
  foreground: "220 13% 91%",
  card: "210 16% 19%",
  cardForeground: "220 13% 91%",
  popover: "210 16% 21%",
  popoverForeground: "220 13% 91%",
  primary: "200 100% 62%",
  primaryForeground: "210 16% 15%",
  secondary: "280 74% 65%",
  secondaryForeground: "210 16% 15%",
  muted: "210 16% 30%",
  mutedForeground: "220 13% 75%",
  accent: "41 92% 62%",
  accentForeground: "210 16% 15%",
  destructive: "0 100% 67%",
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

export const sublimeMaterialTheme: ThemeColors = {
  background: "200 26% 15%",
  foreground: "0 0% 95%",
  card: "200 26% 19%",
  cardForeground: "0 0% 95%",
  popover: "200 26% 21%",
  popoverForeground: "0 0% 95%",
  primary: "200 100% 50%",
  primaryForeground: "200 26% 15%",
  secondary: "260 100% 65%",
  secondaryForeground: "200 26% 15%",
  muted: "200 26% 30%",
  mutedForeground: "0 0% 80%",
  accent: "45 100% 55%",
  accentForeground: "200 26% 15%",
  destructive: "0 100% 60%",
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

export const cyberpunk2077Theme: ThemeColors = {
  background: "0 0% 0%",
  foreground: "0 0% 100%",
  card: "320 5% 8%",
  cardForeground: "0 0% 100%",
  popover: "320 5% 10%",
  popoverForeground: "0 0% 100%",
  primary: "300 100% 50%",
  primaryForeground: "0 0% 0%",
  secondary: "180 100% 50%",
  secondaryForeground: "0 0% 0%",
  muted: "320 5% 20%",
  mutedForeground: "0 0% 80%",
  accent: "60 100% 50%",
  accentForeground: "0 0% 0%",
  destructive: "0 100% 50%",
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

export const bladeRunnerTheme: ThemeColors = {
  background: "90 40% 8%",
  foreground: "90 100% 85%",
  card: "90 40% 12%",
  cardForeground: "90 100% 85%",
  popover: "90 40% 14%",
  popoverForeground: "90 100% 85%",
  primary: "90 100% 50%",
  primaryForeground: "90 40% 8%",
  secondary: "40 100% 50%",
  secondaryForeground: "90 40% 8%",
  muted: "90 40% 25%",
  mutedForeground: "90 100% 70%",
  accent: "40 100% 55%",
  accentForeground: "90 40% 8%",
  destructive: "0 100% 60%",
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

export function getTheme(name: ThemeName): ThemeColors {
  return themes[name];
}
