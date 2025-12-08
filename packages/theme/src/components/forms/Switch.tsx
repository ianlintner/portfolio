"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: "sm" | "md";
}

const trackSizes: Record<NonNullable<SwitchProps["size"]>, string> = {
  sm: "h-6 w-10",
  md: "h-7 w-12",
};

const thumbSizes: Record<NonNullable<SwitchProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-[18px] w-[18px]",
};

const thumbTranslations: Record<NonNullable<SwitchProps["size"]>, string> = {
  sm: "translate-x-1",
  md: "translate-x-[6px]",
};

const thumbCheckedTranslations: Record<NonNullable<SwitchProps["size"]>, string> = {
  sm: "translate-x-[22px]",
  md: "translate-x-[26px]",
};

/**
 * Switch
 *
 * Accessible toggle switch component.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { className, checked, onCheckedChange, size = "md", disabled, ...props },
    ref
  ) => {
    const handleToggle = () => {
      if (disabled) return;
      onCheckedChange(!checked);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex items-center rounded-full border border-input",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          trackSizes[size],
          checked ? "bg-primary/40 border-primary" : "bg-muted/50",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-sm",
            "transition-transform duration-200 ease-out",
            thumbSizes[size],
            checked ? thumbCheckedTranslations[size] : thumbTranslations[size]
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
