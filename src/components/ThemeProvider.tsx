"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeName } from "@/config/themes";
import { getTheme, themeToCSSVars } from "@/config/themes";

interface ThemeContextValue {
  customTheme: ThemeName;
  setCustomTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [customTheme, setCustomThemeState] = useState<ThemeName>("dark-glassy");
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const storedCustomTheme = localStorage.getItem(
      "custom-theme",
    ) as ThemeName | null;

    if (storedCustomTheme) {
      setCustomThemeState(storedCustomTheme);
      applyCustomTheme(storedCustomTheme);
    } else {
      applyCustomTheme("dark-glassy");
    }

    setMounted(true);
  }, []);

  /**
   * Apply custom theme by setting CSS variables
   */
  const applyCustomTheme = (themeName: ThemeName) => {
    const theme = getTheme(themeName);
    const cssVars = themeToCSSVars(theme);

    // Apply to root element
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const setCustomTheme = (themeName: ThemeName) => {
    setCustomThemeState(themeName);
    localStorage.setItem("custom-theme", themeName);
    applyCustomTheme(themeName);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        customTheme,
        setCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
