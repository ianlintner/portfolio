"use client";

import { ReactNode } from "react";

// Static build: tRPC/NextAuth are disabled, so we simply render children.
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
