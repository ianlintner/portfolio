"use client";

import React from "react";
import { cn } from "../../utils/cn";

export type CardVariant = "default" | "glass" | "outline";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padded?: boolean;
  hoverable?: boolean;
  elevated?: boolean;
}

const variantMap: Record<CardVariant, string> = {
  default: "bg-card/60 border border-border/60",
  glass: "glass border border-border/40",
  outline: "bg-background/40 border border-border",
};

/**
 * Card
 *
 * A flexible surface for grouping related content.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padded = true,
      hoverable = false,
      elevated = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl shadow-sm transition-all duration-200",
          variantMap[variant],
          padded && "p-6",
          hoverable && "hover:shadow-glow hover:-translate-y-[1px]",
          elevated && "shadow-glow-sm",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  ),
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-3 pt-4", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";
