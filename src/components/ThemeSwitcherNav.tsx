"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import ThemeSwitcher to prevent SSR/SSG issues
const ThemeSwitcher = dynamic(() => import("./ThemeSwitcher").then(mod => ({ default: mod.ThemeSwitcher })), {
  ssr: false,
  loading: () => <div className="w-32 h-10" />,
});

/**
 * Wrapper component for ThemeSwitcher with dynamic import
 * Prevents hydration/SSG issues by only rendering on client
 */
export function ThemeSwitcherNav() {
  return (
    <Suspense fallback={<div className="w-32 h-10" />}>
      <ThemeSwitcher />
    </Suspense>
  );
}
