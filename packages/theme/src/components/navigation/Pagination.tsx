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

function createPageNumbers(current: number, total: number) {
  const pages: (number | "ellipsis")[] = [];
  const delta = 1;
  const range = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  if (current - delta > 2) range.unshift("ellipsis");
  if (current + delta < total - 1) range.push("ellipsis");
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

  const go = (p: number) => {
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

      {showEdges && pages.map((p, idx) => (
        <React.Fragment key={idx}>
          {p === "ellipsis" ? (
            <span className="px-2 text-muted-foreground">…</span>
          ) : (
            <button
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
          )}
        </React.Fragment>
      ))}

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
