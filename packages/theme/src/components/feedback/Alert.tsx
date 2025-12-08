"use client";

import React from "react";
import { cn } from "../../utils/cn";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

const variantStyles: Record<AlertVariant, string> = {
  info: "border border-border/60 bg-muted/40 text-foreground",
  success: "border border-emerald-500/50 bg-emerald-500/10 text-emerald-100",
  warning: "border border-amber-400/60 bg-amber-400/10 text-amber-50",
  destructive: "border border-destructive/60 bg-destructive/10 text-destructive-foreground",
};

const iconMap: Record<AlertVariant, JSX.Element> = {
  info: (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  warning: (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  destructive: (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = "info", title, description, icon, action, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          "relative flex gap-3 rounded-xl px-4 py-3 shadow-sm",
          "backdrop-blur",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        <div className="mt-0.5 text-foreground/90">
          {icon || iconMap[variant]}
        </div>

        <div className="flex-1 space-y-1">
          {title && <div className="text-sm font-semibold leading-5">{title}</div>}
          {(description || children) && (
            <div className="text-sm text-foreground/80">
              {description || children}
            </div>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  },
);
Alert.displayName = "Alert";
