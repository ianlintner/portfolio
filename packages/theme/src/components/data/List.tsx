"use client";

import React from "react";
import { cn } from "../../utils/cn";

export type ListVariant = "default" | "muted" | "bordered";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  ordered?: boolean;
  variant?: ListVariant;
  gap?: number | string;
  marker?: React.ReactNode;
}

const variantMap: Record<ListVariant, string> = {
  default: "",
  muted: "text-muted-foreground",
  bordered: "divide-y divide-border/60 rounded-xl border border-border/60",
};

/**
 * List
 *
 * A simple list with optional custom marker and variants.
 */
export function List({
  className,
  children,
  ordered = false,
  variant = "default",
  gap = 2,
  marker,
  ...props
}: ListProps) {
  const Component = ordered ? "ol" : "ul";
  const gapClass = typeof gap === "number" ? `space-y-${gap}` : undefined;

  return (
    <Component
      className={cn("list-none", variantMap[variant], gapClass, className)}
      {...props}
    >
      {React.Children.map(children, (child, idx) => (
        <li className="flex items-start gap-3 py-1">
          {marker !== undefined ? (
            <span
              className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full bg-primary/70"
              aria-hidden
            >
              {typeof marker === "function" ? (marker as any)(idx) : marker}
            </span>
          ) : (
            <span
              className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">{child}</div>
        </li>
      ))}
    </Component>
  );
}
