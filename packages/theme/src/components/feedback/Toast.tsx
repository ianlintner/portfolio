"use client";

import React from "react";
import { cn } from "../../utils/cn";
import type { AlertVariant } from "./Alert";

export type ToastVariant = AlertVariant | "neutral";

const variantStyles: Record<ToastVariant, string> = {
  neutral: "bg-background/90 text-foreground border border-border/60",
  info: "bg-background/90 text-foreground border border-border/60",
  success: "bg-emerald-600/10 text-emerald-50 border border-emerald-500/50",
  warning: "bg-amber-500/10 text-amber-50 border border-amber-400/60",
  destructive: "bg-destructive/15 text-destructive-foreground border border-destructive/60",
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  closeLabel?: string;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function Toast({
  className,
  variant = "neutral",
  title,
  description,
  icon,
  actionLabel,
  onAction,
  onClose,
  closeLabel = "Close",
  children,
  ...props
}: ToastProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 shadow-lg backdrop-blur",
        "transition-all duration-200",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon && <div className="mt-0.5 shrink-0 text-foreground/90">{icon}</div>}
      <div className="flex-1 space-y-1">
        {title && <div className="text-sm font-semibold leading-5">{title}</div>}
        {(description || children) && (
          <div className="text-sm text-foreground/80">{description || children}</div>
        )}
        {(actionLabel && onAction) && (
          <button
            type="button"
            onClick={onAction}
            className="mt-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="mt-0.5 rounded-md p-1 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
