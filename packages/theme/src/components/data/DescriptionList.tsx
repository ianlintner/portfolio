"use client";

import React from "react";
import { cn } from "../../utils/cn";

type ColumnCount = 1 | 2 | 3 | 4;

export interface DescriptionListItem {
  term: React.ReactNode;
  description: React.ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items?: DescriptionListItem[];
  columns?: ColumnCount;
  muted?: boolean;
  bordered?: boolean;
}

/**
 * DescriptionList
 *
 * A semantic dl with grid layout support.
 */
export function DescriptionList({
  className,
  items,
  children,
  columns = 2,
  muted = false,
  bordered = false,
  ...props
}: DescriptionListProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <dl
      className={cn(
        "grid gap-4",
        gridCols,
        bordered && "rounded-xl border border-border/60 p-4",
        className,
      )}
      {...props}
    >
      {items
        ? items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <dt
                className={cn(
                  "text-sm font-medium",
                  muted && "text-muted-foreground",
                )}
              >
                {item.term}
              </dt>
              <dd className="text-sm text-foreground/90">{item.description}</dd>
            </div>
          ))
        : children}
    </dl>
  );
}
