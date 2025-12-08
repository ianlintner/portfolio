"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  align?: "start" | "center" | "end";
}

export function Popover({
  trigger,
  children,
  open,
  onOpenChange,
  className,
  align = "start",
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? (open as boolean) : internalOpen;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    }
    if (currentOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentOpen, isControlled, onOpenChange]);

  const toggle = () => {
    const next = !currentOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const alignClasses: Record<typeof align, string> = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  } as const;

  return (
    <div className="relative inline-flex" ref={ref}>
      <button type="button" onClick={toggle} className="inline-flex">
        {trigger}
      </button>
      {currentOpen && (
        <div
          className={cn(
            "absolute z-40 mt-2 min-w-[220px] rounded-xl border border-border/60 bg-card/95 p-3 shadow-xl",
            "animate-in fade-in-0 zoom-in-95",
            alignClasses[align],
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
