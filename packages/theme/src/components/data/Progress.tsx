"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  label?: React.ReactNode;
  showValue?: boolean;
  color?: "primary" | "accent" | "success" | "warning" | "destructive";
}

const colorMap: Record<NonNullable<ProgressProps["color"]>, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  destructive: "bg-destructive",
};

export function Progress({
  className,
  value,
  label,
  showValue = true,
  color = "primary",
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {label && <span>{label}</span>}
          {showValue && <span>{clamped}%</span>}
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-muted/40">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            colorMap[color],
          )}
          style={{ width: `${clamped}%` }}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
}
