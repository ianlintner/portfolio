"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "error"
    | "info";
  /** Size of the badge */
  size?: "sm" | "md" | "lg";
  /** Show a status dot */
  dot?: boolean;
  /** Add glow effect */
  glow?: boolean;
  /** Make the badge pill-shaped (more rounded) */
  pill?: boolean;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border bg-transparent text-foreground",
  success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2 py-0.5 gap-1.5",
  lg: "text-sm px-2.5 py-1 gap-1.5",
};

const dotVariantColors: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary-foreground",
  secondary: "bg-secondary-foreground",
  outline: "bg-foreground",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
  info: "bg-blue-400",
};

const glowVariantColors: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "shadow-[0_0_10px_hsla(var(--primary),0.5)]",
  secondary: "shadow-[0_0_10px_hsla(var(--secondary),0.5)]",
  outline: "shadow-[0_0_10px_hsla(var(--border),0.5)]",
  success: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
  warning: "shadow-[0_0_10px_rgba(245,158,11,0.5)]",
  error: "shadow-[0_0_10px_rgba(239,68,68,0.5)]",
  info: "shadow-[0_0_10px_rgba(59,130,246,0.5)]",
};

/**
 * Badge Component
 *
 * A small status indicator with various styles and optional dot/glow effects.
 *
 * @example
 * // Basic badge
 * <Badge>New</Badge>
 *
 * // Status badge with dot
 * <Badge variant="success" dot>Online</Badge>
 *
 * // Warning badge with glow
 * <Badge variant="warning" glow>Pending</Badge>
 *
 * // Pill-shaped badge
 * <Badge variant="info" pill>Beta</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      dot = false,
      glow = false,
      pill = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center font-medium leading-none",
          "transition-all duration-200",

          // Border radius
          pill ? "rounded-full" : "rounded-md",

          // Variant styles
          variantStyles[variant],

          // Size styles
          sizeStyles[size],

          // Glow effect
          glow && glowVariantColors[variant],

          className
        )}
        {...props}
      >
        {/* Status dot */}
        {dot && (
          <span
            className={cn(
              "shrink-0 rounded-full animate-pulse",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2.5 h-2.5",
              dotVariantColors[variant]
            )}
          />
        )}

        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

/**
 * NotificationBadge Component
 *
 * A badge designed to show notification counts, typically positioned over an icon.
 */
export interface NotificationBadgeProps {
  /** The count to display (shows max value with + if exceeded) */
  count?: number;
  /** Maximum count to show before displaying "max+" */
  max?: number;
  /** Show as a simple dot instead of count */
  dot?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional classes */
  className?: string;
}

export const NotificationBadge = forwardRef<
  HTMLSpanElement,
  NotificationBadgeProps
>(({ count, max = 99, dot = false, size = "md", className }, ref) => {
  if (count === undefined && !dot) return null;
  if (count === 0 && !dot) return null;

  const displayValue = dot
    ? null
    : count !== undefined && count > max
    ? `${max}+`
    : count;

  const sizeClasses = {
    sm: dot ? "w-2 h-2" : "min-w-4 h-4 text-[10px] px-1",
    md: dot ? "w-2.5 h-2.5" : "min-w-5 h-5 text-xs px-1.5",
    lg: dot ? "w-3 h-3" : "min-w-6 h-6 text-sm px-2",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center",
        "bg-destructive text-destructive-foreground font-medium",
        "rounded-full",
        sizeClasses[size],
        className
      )}
    >
      {displayValue}
    </span>
  );
});

NotificationBadge.displayName = "NotificationBadge";
