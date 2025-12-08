"use client";

import React, { useId, useState } from "react";
import { cn } from "../../utils/cn";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  className?: string;
  placement?: TooltipPlacement;
  delay?: number;
}

export function Tooltip({
  content,
  children,
  className,
  placement = "top",
  delay = 120,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const id = useId();

  const show = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const idHandle = setTimeout(() => setOpen(true), delay);
    setTimeoutId(idHandle);
  };

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setOpen(false);
  };

  const positionClasses: Record<TooltipPlacement, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 -translate-y-2",
    right: "left-full top-1/2 translate-x-2 -translate-y-1/2",
    bottom: "top-full left-1/2 -translate-x-1/2 translate-y-2",
    left: "right-full top-1/2 -translate-x-2 -translate-y-1/2",
  };

  return (
    <span className="relative inline-flex">
      {React.cloneElement(children, {
        onMouseEnter: (e: React.MouseEvent) => {
          children.props.onMouseEnter?.(e);
          show();
        },
        onMouseLeave: (e: React.MouseEvent) => {
          children.props.onMouseLeave?.(e);
          hide();
        },
        onFocus: (e: React.FocusEvent) => {
          children.props.onFocus?.(e);
          show();
        },
        onBlur: (e: React.FocusEvent) => {
          children.props.onBlur?.(e);
          hide();
        },
        "aria-describedby": open ? id : undefined,
      })}

      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-lg",
            "animate-in fade-in-0 zoom-in-95",
            positionClasses[placement],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
