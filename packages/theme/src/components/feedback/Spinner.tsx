"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "accent" | "muted" | "destructive" | "success" | "warning";
  label?: string;
}

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

const colorMap: Record<NonNullable<SpinnerProps["variant"]>, string> = {
  primary: "text-primary",
  accent: "text-accent",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
  success: "text-emerald-400",
  warning: "text-amber-400",
};

export function Spinner({
  className,
  size = "md",
  variant = "primary",
  label,
  ...props
}: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2" aria-live="polite">
      <svg
        aria-hidden
        className={cn("animate-spin", sizeMap[size], colorMap[variant], className)}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  );
}
