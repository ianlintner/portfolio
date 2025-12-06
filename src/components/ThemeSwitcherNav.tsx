"use client";

import { Suspense } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

/**
 * Wrapper component for ThemeSwitcher with Suspense boundary
 * Prevents hydration issues by deferring theme switcher rendering
 */
export function ThemeSwitcherNav() {
  return (
    <Suspense fallback={<div className="w-32 h-10" />}>
      <ThemeSwitcher />
    </Suspense>
  );
}
