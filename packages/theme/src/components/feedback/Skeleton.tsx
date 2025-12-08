import React from "react";
import { cn } from "../../utils/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/60",
        "relative overflow-hidden",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.6s_infinite]" />
    </div>
  );
}

// Custom keyframes for shimmer
// Included inline for portability; Tailwind users can add to config for global use.
const style =
  typeof document !== "undefined" ? document.createElement("style") : null;
if (style && !document.getElementById("skeleton-shimmer")) {
  style.id = "skeleton-shimmer";
  style.innerHTML = `@keyframes shimmer {100% { transform: translateX(100%); }}`;
  document.head.appendChild(style);
}
