import React from "react";
import { cn } from "../../utils/cn";

export interface NavLinkProps
  extends React.HTMLAttributes<HTMLElement> {
  active?: boolean;
  icon?: React.ReactNode;
  /** Render as a different element (use "span" when wrapped in Next.js Link) */
  as?: "a" | "span" | "button";
  href?: string;
}

export function NavLink({
  className,
  active = false,
  icon,
  children,
  as: Component = "a",
  ...props
}: NavLinkProps) {
  return (
    <Component
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </Component>
  );
}
