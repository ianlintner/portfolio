"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "../../utils/cn";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Render an indeterminate state (visually a dash). */
  indeterminate?: boolean;
}

/**
 * Checkbox
 *
 * Styled checkbox supporting indeterminate state.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate && !props.checked;
      }
    }, [indeterminate, props.checked]);

    return (
      <input
        ref={internalRef}
        type="checkbox"
        className={cn(
          "h-4 w-4 shrink-0 rounded-sm border border-input bg-background/80",
          "text-primary shadow-sm transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "accent-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";
