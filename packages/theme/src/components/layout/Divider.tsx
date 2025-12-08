"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
  variant?: "muted" | "strong" | "glow";
}

const baseLine = "flex-1 bg-border/70";
const variantMap: Record<NonNullable<DividerProps["variant"]>, string> = {
  muted: baseLine,
  strong: "flex-1 bg-foreground/40",
  glow: "flex-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 blur-[0.2px]",
};

/**
 * Divider
 *
 * A horizontal or vertical separator with optional centered label.
 */
export function Divider({
  className,
  orientation = "horizontal",
  label,
  variant = "muted",
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "flex h-full flex-col items-center",
          label ? "gap-2 px-2" : "px-1",
          className,
        )}
        {...props}
      >
        <span className={cn("w-px flex-1", variantMap[variant])} />
        {label && (
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <span className={cn("w-px flex-1", variantMap[variant])} />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-center",
        label ? "gap-3" : "gap-2",
        className,
      )}
      {...props}
    >
      <span className={cn("h-px", variantMap[variant])} />
      {label && (
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      )}
      <span className={cn("h-px", variantMap[variant])} />
    </div>
  );
}
