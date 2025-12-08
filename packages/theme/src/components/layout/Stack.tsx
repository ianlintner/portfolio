"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  gap?: number | string;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: boolean;
}

/**
 * Stack
 *
 * A simple flex stack with configurable direction, gap, alignment, and wrapping.
 */
export function Stack({
  className,
  direction = "vertical",
  gap = 3,
  align,
  justify,
  wrap = false,
  style,
  ...props
}: StackProps) {
  const gapClass = typeof gap === "number" ? `gap-${gap}` : undefined;

  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        gapClass,
        wrap && "flex-wrap",
        className
      )}
      style={{
        alignItems: align,
        justifyContent: justify,
        gap: typeof gap === "string" ? gap : undefined,
        ...style,
      }}
      {...props}
    />
  );
}
