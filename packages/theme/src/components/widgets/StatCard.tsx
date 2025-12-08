import React from "react";
import { cn } from "../../utils/cn";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  helper?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

const trendClasses: Record<NonNullable<StatCardProps["trend"]>, string> = {
  up: "text-emerald-400",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

export function StatCard({
  className,
  label,
  value,
  helper,
  trend = "neutral",
  icon,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold leading-tight">{value}</div>
          {helper && <div className="text-xs text-muted-foreground/80">{helper}</div>}
        </div>
        {icon && <div className="rounded-xl bg-muted/50 p-3 text-primary">{icon}</div>}
      </div>
      <div className={cn("mt-3 text-xs font-medium", trendClasses[trend])}>
        {trend === "up" && "▲"}
        {trend === "down" && "▼"}
        {trend === "neutral" && "▬"} Trend
      </div>
    </div>
  );
}
