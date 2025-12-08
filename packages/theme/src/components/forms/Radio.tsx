"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/**
 * Radio
 *
 * Styled radio button.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        className={cn(
          "h-4 w-4 shrink-0 rounded-full border border-input bg-background/80",
          "text-primary shadow-sm transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "accent-primary",
          className
        )}
        {...props}
      />
    );
  }
);

Radio.displayName = "Radio";
