"use client";

import React from "react";
import { cn } from "../../utils/cn";

type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ResponsiveCols = {
  base?: GridSpan;
  sm?: GridSpan;
  md?: GridSpan;
  lg?: GridSpan;
  xl?: GridSpan;
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: ResponsiveCols | GridSpan;
  gap?: number | string;
  equalHeight?: boolean;
}

const spanClass = (prefix: string, value?: GridSpan) =>
  value ? `${prefix}grid-cols-${value}` : undefined;

/**
 * Grid
 *
 * Responsive CSS grid with shorthand for breakpoint column counts.
 */
export function Grid({
  className,
  cols = { base: 1, md: 2, lg: 3 },
  gap = 4,
  equalHeight = false,
  style,
  children,
  ...props
}: GridProps) {
  const config: ResponsiveCols = typeof cols === "number" ? { base: cols } : cols;

  const gapClass = typeof gap === "number" ? `gap-${gap}` : undefined;

  return (
    <div
      className={cn(
        "grid",
        spanClass("", config.base ?? 1),
        spanClass("sm:", config.sm),
        spanClass("md:", config.md),
        spanClass("lg:", config.lg),
        spanClass("xl:", config.xl),
        gapClass,
        equalHeight && "[&>*]:h-full",
        className
      )}
      style={{ gap: typeof gap === "string" ? gap : undefined, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
