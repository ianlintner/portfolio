"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

// Static build: tRPC/NextAuth are disabled, so we simply render children.
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
