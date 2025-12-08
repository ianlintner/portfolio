"use client";

import React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../primitives/Button";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showEdges?: boolean;
}

const ELLIPSIS = "ellipsis" as const;
type PageValue = number | typeof ELLIPSIS;

function createPageNumbers(current: number, total: number): PageValue[] {
  const delta = 1;
  const range: PageValue[] = [];
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }
  if (current - delta > 2) range.unshift(ELLIPSIS);
  if (current + delta < total - 1) range.push(ELLIPSIS);
  return [1, ...range, total];
}

export function Pagination({
  className,
  page,
  totalPages,
  onPageChange,
  showEdges = true,
  ...props
}: PaginationProps) {
  const pages = createPageNumbers(page, Math.max(totalPages, 1));

  const go = (p: PageValue) => {
    if (p === ELLIPSIS) return;

    const clamped = Math.min(Math.max(1, p), totalPages);
    if (clamped !== page) onPageChange(clamped);
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Prev
      </Button>

      {showEdges &&
        pages.map((p, idx) => {
          if (p === "ellipsis") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-muted-foreground"
              >
                …
              </span>
            );
          }

          return (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              className={cn(
                "min-w-[38px] rounded-lg px-3 py-2 text-sm font-medium transition",
                p === page
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background text-foreground hover:bg-muted/50",
              )}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </Button>
    </div>
  );
}
