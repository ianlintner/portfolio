"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the separator */
  orientation?: "horizontal" | "vertical";
  /** Whether it's purely decorative (affects accessibility) */
  decorative?: boolean;
  /** Add glow effect */
  glow?: boolean;
  /** Visual variant */
  variant?: "default" | "dashed" | "dotted" | "gradient";
  /** Size (thickness) */
  size?: "sm" | "md" | "lg";
  /** Label text to show in the middle */
  label?: string;
}

const orientationStyles: Record<
  NonNullable<SeparatorProps["orientation"]>,
  string
> = {
  horizontal: "w-full",
  vertical: "h-full self-stretch",
};

const sizeStyles: Record<
  NonNullable<SeparatorProps["orientation"]>,
  Record<NonNullable<SeparatorProps["size"]>, string>
> = {
  horizontal: {
    sm: "h-px",
    md: "h-0.5",
    lg: "h-1",
  },
  vertical: {
    sm: "w-px",
    md: "w-0.5",
    lg: "w-1",
  },
};

const variantStyles: Record<NonNullable<SeparatorProps["variant"]>, string> = {
  default: "bg-border",
  dashed: "bg-transparent border-dashed",
  dotted: "bg-transparent border-dotted",
  gradient:
    "bg-gradient-to-r from-transparent via-border to-transparent border-0",
};

/**
 * Separator Component
 *
 * A visual divider for separating content sections.
 *
 * @example
 * // Basic horizontal separator
 * <Separator />
 *
 * // Vertical separator
 * <Separator orientation="vertical" />
 *
 * // With gradient effect
 * <Separator variant="gradient" />
 *
 * // With label
 * <Separator label="Or continue with" />
 *
 * // With glow effect
 * <Separator glow />
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      glow = false,
      variant = "default",
      size = "sm",
      label,
      ...props
    },
    ref,
  ) => {
    // If we have a label, render a different structure
    if (label && orientation === "horizontal") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-4 w-full", className)}
          role={decorative ? "none" : "separator"}
          aria-orientation={orientation}
          {...props}
        >
          <div
            className={cn(
              "flex-1",
              sizeStyles[orientation][size],
              variantStyles[variant],
              glow && "shadow-[0_0_8px_hsla(var(--glow-primary),0.3)]",
            )}
          />
          <span className="text-muted-foreground text-sm font-medium shrink-0">
            {label}
          </span>
          <div
            className={cn(
              "flex-1",
              sizeStyles[orientation][size],
              variantStyles[variant],
              glow && "shadow-[0_0_8px_hsla(var(--glow-primary),0.3)]",
            )}
          />
        </div>
      );
    }

    // Handle dashed/dotted variants with border instead of background
    const isDashedOrDotted = variant === "dashed" || variant === "dotted";
    const borderStyles = isDashedOrDotted
      ? orientation === "horizontal"
        ? "border-t border-border"
        : "border-l border-border"
      : "";

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation}
        className={cn(
          "shrink-0",
          orientationStyles[orientation],
          sizeStyles[orientation][size],
          variantStyles[variant],
          borderStyles,
          glow && "shadow-[0_0_8px_hsla(var(--glow-primary),0.3)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";
