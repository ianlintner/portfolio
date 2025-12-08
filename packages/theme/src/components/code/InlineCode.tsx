import React from "react";
import { cn } from "../../utils/cn";

export interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

/**
 * InlineCode - lightweight inline code styling
 */
export function InlineCode({
  as: Component = "code",
  className,
  children,
  ...props
}: InlineCodeProps) {
  return (
    <Component
      className={cn(
        "rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-sm text-foreground",
        "border border-border/60",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
