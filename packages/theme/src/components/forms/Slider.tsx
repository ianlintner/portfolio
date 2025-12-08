"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Show a value bubble above the thumb */
  showValue?: boolean;
  /** Optional formatter for the displayed value */
  formatValue?: (value: number) => string;
}

/**
 * Slider
 *
 * Styled range input with optional inline value display.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      showValue = false,
      formatValue = (v) => v.toString(),
      value,
      min = 0,
      max = 100,
      step = 1,
      ...props
    },
    ref,
  ) => {
    const numericValue = typeof value === "number" ? value : undefined;
    const percentage =
      numericValue === undefined
        ? undefined
        : ((numericValue - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="flex w-full flex-col gap-1">
        <input
          ref={ref}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full cursor-pointer appearance-none bg-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full",
            "[&::-webkit-slider-runnable-track]:bg-muted [&::-moz-range-track]:h-2",
            "[&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-glow-sm",
            "[&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:top-1/2",
            "[&::-webkit-slider-thumb]:-translate-y-1/2",
            "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
            "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary",
            "[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-glow-sm",
            className,
          )}
          {...props}
        />
        {showValue && numericValue !== undefined && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatValue(numericValue)}</span>
            {percentage !== undefined && (
              <span aria-hidden>{Math.round(percentage)}%</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Slider.displayName = "Slider";
