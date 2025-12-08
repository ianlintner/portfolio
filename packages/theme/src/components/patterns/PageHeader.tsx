import React from "react";
import { cn } from "../../utils/cn";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  className,
  title,
  description,
  actions,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
