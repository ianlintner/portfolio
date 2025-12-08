"use client";

import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Show a required indicator. If you pass a React node, it will render that instead of the default asterisk. */
  requiredIndicator?: boolean | React.ReactNode;
  /** Optional helper text to show alongside the label (e.g., "Optional"). */
  optionalText?: React.ReactNode;
}

/**
 * Label
 *
 * Accessible label with optional required and optional indicators.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className,
      children,
      requiredIndicator = false,
      optionalText,
      ...props
    },
    ref
  ) => {
    const requiredMarkup =
      requiredIndicator === true ? (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      ) : requiredIndicator ? (
        <span aria-hidden="true">{requiredIndicator}</span>
      ) : null;

    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-foreground",
          "flex items-center gap-2 select-none",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {requiredMarkup}
        </span>
        {optionalText && (
          <span className="text-xs font-normal text-muted-foreground">
            {optionalText}
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";
