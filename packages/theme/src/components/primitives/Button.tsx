"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "glass";
  /** Size of the button */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Add glow effect on hover */
  glow?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to show on the left */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right */
  rightIcon?: React.ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
  /** Render as a different element (for use with links) */
  asChild?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: cn(
    "bg-primary text-primary-foreground",
    "hover:bg-primary/90",
    "active:bg-primary/80",
    "focus-visible:ring-primary",
  ),
  secondary: cn(
    "bg-secondary text-secondary-foreground",
    "hover:bg-secondary/80",
    "active:bg-secondary/70",
    "focus-visible:ring-secondary",
  ),
  outline: cn(
    "border border-border bg-transparent text-foreground",
    "hover:bg-accent/10 hover:border-accent",
    "active:bg-accent/20",
    "focus-visible:ring-accent",
  ),
  ghost: cn(
    "bg-transparent text-foreground",
    "hover:bg-accent/10",
    "active:bg-accent/20",
    "focus-visible:ring-accent",
  ),
  destructive: cn(
    "bg-destructive text-destructive-foreground",
    "hover:bg-destructive/90",
    "active:bg-destructive/80",
    "focus-visible:ring-destructive",
  ),
  glass: cn(
    "glass text-foreground",
    "hover:glass-elevated",
    "active:bg-glass-dark/60",
    "focus-visible:ring-primary",
  ),
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "h-7 px-2 text-xs gap-1 rounded",
  sm: "h-8 px-3 text-sm gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-6 text-base gap-2 rounded-lg",
  xl: "h-12 px-8 text-lg gap-3 rounded-xl",
};

const iconSizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "[&_svg]:w-3 [&_svg]:h-3",
  sm: "[&_svg]:w-4 [&_svg]:h-4",
  md: "[&_svg]:w-4 [&_svg]:h-4",
  lg: "[&_svg]:w-5 [&_svg]:h-5",
  xl: "[&_svg]:w-6 [&_svg]:h-6",
};

/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading state, icons, and glass effects.
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click me</Button>
 *
 * // Glass button with glow
 * <Button variant="glass" glow>Glassy</Button>
 *
 * // Loading state
 * <Button loading>Submitting...</Button>
 *
 * // With icons
 * <Button leftIcon={<PlusIcon />}>Add Item</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      glow = false,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      asChild,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const classes = cn(
      // Base styles
      "inline-flex items-center justify-center font-medium",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

      // Variant styles
      variantStyles[variant],

      // Size styles
      sizeStyles[size],
      iconSizeStyles[size],

      // Glow effect
      glow && "hover:shadow-glow",

      // Full width
      fullWidth && "w-full",

      // Disabled state
      isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",

      className,
    );

    // If asChild is true, render the child element as the root and merge styles/props.
    if (asChild && React.isValidElement(children)) {
      // React's type for ReactElement props is `unknown` by default; for `asChild` we intentionally
      // accept any valid element and forward common props (e.g., aria-label) + className.
      const child = children as React.ReactElement<any>;
      const childProps: any = {
        ...props,
        className: cn(classes, child.props?.className),
        ...(isDisabled && { "aria-disabled": true, tabIndex: -1 }),
      };

      return React.cloneElement(child, childProps);
    }

    return (
      <button ref={ref} disabled={isDisabled} className={classes} {...props}>
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left icon */}
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

        {/* Children */}
        {children}

        {/* Right icon */}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

/**
 * IconButton Component
 *
 * A square button designed for icon-only usage.
 */
export interface IconButtonProps extends Omit<
  ButtonProps,
  "leftIcon" | "rightIcon" | "children"
> {
  /** The icon to display */
  icon: React.ReactNode;
  /** Accessible label for screen readers */
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "md", icon, ...props }, ref) => {
    const iconButtonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      xs: "h-7 w-7",
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-11 w-11",
      xl: "h-12 w-12",
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn("!px-0", iconButtonSizes[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
