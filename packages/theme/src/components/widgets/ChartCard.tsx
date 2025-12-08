import React from "react";
import { cn } from "../../utils/cn";

export interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode; // chart area
}

export function ChartCard({
  className,
  title,
  description,
  action,
  footer,
  children,
  ...props
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur",
        className,
      )}
      {...props}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-base font-semibold leading-tight">{title}</div>
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="rounded-xl bg-muted/30 p-3">{children}</div>
      {footer && <div className="mt-3 text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
