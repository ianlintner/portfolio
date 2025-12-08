"use client";

import React from "react";
import { cn } from "../../utils/cn";

export type Trend = "up" | "down" | "neutral";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  helper?: React.ReactNode;
  trend?: Trend;
  icon?: React.ReactNode;
  variant?: "default" | "glass" | "subtle";
}

const trendColor: Record<Trend, string> = {
  up: "text-emerald-400",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

const variantMap: Record<NonNullable<StatProps["variant"]>, string> = {
  default: "bg-card/60 border border-border/60",
  glass: "glass border border-border/40",
  subtle: "bg-muted/20 border border-border/40",
};

export function Stat({
  className,
  label,
  value,
  helper,
  trend = "neutral",
  icon,
  variant = "default",
  ...props
}: StatProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl p-5 shadow-sm",
        variantMap[variant],
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-glow-sm">
            {icon}
          </span>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="text-2xl font-semibold leading-tight">{value}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-right">
        {helper && <span className="text-sm text-muted-foreground">{helper}</span>}
        <span className={cn("text-sm font-semibold", trendColor[trend])}>
          {trend === "up" && "▲"}
          {trend === "down" && "▼"}
          {trend === "neutral" && "■"} {trend !== "neutral" ? helper ?? "" : ""}
        </span>
      </div>
    </div>
  );
}
