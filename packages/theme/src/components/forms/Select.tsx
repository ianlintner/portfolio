"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

type FieldState = "default" | "error" | "success" | "warning";
type FieldVariant = "default" | "ghost" | "glass";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  state?: FieldState;
  variant?: FieldVariant;
  fullWidth?: boolean;
}

const baseStyles = cn(
  "flex min-h-10 rounded-lg border border-input bg-background/60",
  "px-3 pr-10 py-2 text-sm text-foreground shadow-sm",
  "transition-all duration-200 ease-out",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "appearance-none",
);

const variantStyles: Record<FieldVariant, string> = {
  default: "",
  ghost: "border-transparent bg-transparent hover:bg-muted/20",
  glass: "glass border-transparent focus-visible:ring-primary/70",
};

const stateStyles: Record<FieldState, string> = {
  default: "",
  error: "border-destructive focus-visible:ring-destructive/80",
  success: "border-emerald-500 focus-visible:ring-emerald-500",
  warning: "border-amber-400 focus-visible:ring-amber-400",
};

const chevronDataUri =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E";

/**
 * Select
 *
 * Styled native select with custom chevron and validation states.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      state = "default",
      variant = "default",
      fullWidth = true,
      style,
      ...props
    },
    ref,
  ) => {
    const ariaInvalid = props["aria-invalid"];
    const computedState: FieldState =
      ariaInvalid === true || ariaInvalid === "true" ? "error" : state;

    return (
      <select
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          stateStyles[computedState],
          fullWidth && "w-full",
          className,
        )}
        style={{
          backgroundImage: `url(${chevronDataUri})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1rem 1rem",
          ...(style ?? {}),
        }}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
