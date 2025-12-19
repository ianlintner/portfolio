import React from "react";
import { cn } from "../../utils/cn";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends React.OlHTMLAttributes<HTMLOListElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumb({
  className,
  items,
  separator = " / ",
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-sm text-muted-foreground",
          className,
        )}
        {...props}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content =
            item.href && !isLast && !item.active ? (
              <a
                className="transition-colors hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  isLast || item.active ? "text-foreground" : undefined,
                )}
              >
                {item.label}
              </span>
            );
          return (
            <li key={idx} className="inline-flex items-center gap-1">
              {content}
              {!isLast && <span aria-hidden>{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
