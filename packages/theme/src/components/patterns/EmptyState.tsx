import React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../primitives/Button";

export interface EmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/30 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      {icon && <div className="text-3xl">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {(description || children) && (
        <p className="max-w-md text-sm text-muted-foreground">
          {description || children}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
