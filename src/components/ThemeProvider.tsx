"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeName } from "@/config/themes";
import { getTheme, themeToCSSVars } from "@/config/themes";

type DisplayTheme = "light" | "dark" | "system";

interface ThemeContextValue {
  displayTheme: DisplayTheme;
  setDisplayTheme: (theme: DisplayTheme) => void;
  customTheme: ThemeName;
  setCustomTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [displayTheme, setDisplayThemeState] = useState<DisplayTheme>("system");
  const [customTheme, setCustomThemeState] = useState<ThemeName>("dark-glassy");
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const storedDisplayTheme = localStorage.getItem(
      "display-theme",
    ) as DisplayTheme | null;
    const storedCustomTheme = localStorage.getItem(
      "custom-theme",
    ) as ThemeName | null;

    if (storedDisplayTheme) {
      setDisplayThemeState(storedDisplayTheme);
      applyDisplayTheme(storedDisplayTheme);
    } else {
      applyDisplayTheme("system");
    }

    if (storedCustomTheme) {
      setCustomThemeState(storedCustomTheme);
      applyCustomTheme(storedCustomTheme);
    } else {
      applyCustomTheme("dark-glassy");
    }

    setMounted(true);
  }, []);

  /**
   * Apply display theme (light/dark/system mode)
   */
  const applyDisplayTheme = (theme: DisplayTheme) => {
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  };

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

  const setDisplayTheme = (theme: DisplayTheme) => {
    setDisplayThemeState(theme);
    if (theme === "system") {
      localStorage.removeItem("display-theme");
    } else {
      localStorage.setItem("display-theme", theme);
    }
    applyDisplayTheme(theme);
  };

  const setCustomTheme = (themeName: ThemeName) => {
    setCustomThemeState(themeName);
    localStorage.setItem("custom-theme", themeName);
    applyCustomTheme(themeName);
  };

  // Watch system preference changes in "system" mode
  useEffect(() => {
    if (displayTheme === "system" && mounted) {
      const listener = (e: MediaQueryListEvent) => {
        applyDisplayTheme(e.matches ? "dark" : "light");
      };
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    }
  }, [displayTheme, mounted]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        displayTheme,
        setDisplayTheme,
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
