"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

type FieldState = "default" | "error" | "success" | "warning";
type FieldVariant = "default" | "ghost" | "glass";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: FieldState;
  variant?: FieldVariant;
  fullWidth?: boolean;
  /** Disable resize handles */
  noResize?: boolean;
}

const baseStyles = cn(
  "flex w-full min-h-[120px] rounded-lg border border-input bg-background/60",
  "px-3 py-2 text-sm text-foreground shadow-sm",
  "transition-all duration-200 ease-out",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50"
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

/**
 * Textarea
 *
 * Styled textarea with variants, states, and optional resize disabling.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      state = "default",
      variant = "default",
      fullWidth = true,
      noResize = false,
      ...props
    },
    ref
  ) => {
    const ariaInvalid = props["aria-invalid"];
    const computedState: FieldState =
      ariaInvalid === true || ariaInvalid === "true" ? "error" : state;

    return (
      <textarea
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          stateStyles[computedState],
          noResize && "resize-none",
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
