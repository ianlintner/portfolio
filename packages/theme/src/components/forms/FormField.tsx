"use client";

import React from "react";
import { cn } from "../../utils/cn";
import { Label } from "./Label";

export interface FormFieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /**
   * Layout direction. Horizontal pairs label/description to the left of the control.
   */
  layout?: "vertical" | "horizontal";
  /** Secondary content next to the label (e.g., action link, badge). */
  labelAside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * FormField
 *
 * Layout helper for form controls with label, description, and error messaging.
 */
export function FormField({
  label,
  htmlFor,
  required,
  description,
  hint,
  error,
  layout = "vertical",
  labelAside,
  children,
  className,
}: FormFieldProps) {
  const hasLabelMeta = label || description;
  const hasFeedback = hint || error;

  if (layout === "horizontal") {
    return (
      <div
        className={cn(
          "flex w-full flex-col gap-2 rounded-lg border border-border/60 bg-card/40 p-4",
          "glass",
          className,
        )}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
          {hasLabelMeta && (
            <div className="flex min-w-[200px] flex-1 flex-col gap-1 sm:flex-none">
              {label && (
                <div className="flex items-center gap-2">
                  <Label htmlFor={htmlFor} requiredIndicator={required}>
                    {label}
                  </Label>
                  {labelAside && (
                    <div className="text-xs text-muted-foreground">
                      {labelAside}
                    </div>
                  )}
                </div>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}

          <div className="flex-1 space-y-2">
            {children}
            {hasFeedback && (
              <div className="space-y-1 text-sm">
                {error && <p className="text-destructive">{error}</p>}
                {!error && hint && (
                  <p className="text-muted-foreground">{hint}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {hasLabelMeta && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {label && (
              <Label htmlFor={htmlFor} requiredIndicator={required}>
                {label}
              </Label>
            )}
            {labelAside && (
              <div className="text-xs text-muted-foreground">{labelAside}</div>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {children}

      {hasFeedback && (
        <div className="space-y-1 text-sm">
          {error && <p className="text-destructive">{error}</p>}
          {!error && hint && <p className="text-muted-foreground">{hint}</p>}
        </div>
      )}
    </div>
  );
}
