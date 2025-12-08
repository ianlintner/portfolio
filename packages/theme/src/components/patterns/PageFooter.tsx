import React from "react";
import { cn } from "../../utils/cn";

export interface PageFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function PageFooter({ className, left, right, ...props }: PageFooterProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 border-t border-border/60 pt-4", className)} {...props}>
      <div className="text-sm text-muted-foreground">{left}</div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">{right}</div>
    </div>
  );
}
