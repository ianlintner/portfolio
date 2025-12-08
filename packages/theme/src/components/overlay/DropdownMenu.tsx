"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface DropdownItem {
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "start" | "center" | "end";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "start",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const alignClasses: Record<typeof align, string> = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  } as const;

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-40 mt-2 min-w-[200px] rounded-xl border border-border/60 bg-card/95 p-2 shadow-xl",
            alignClasses[align],
            className,
          )}
          role="menu"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm text-foreground transition",
                item.disabled
                  ? "cursor-not-allowed text-muted-foreground"
                  : "hover:bg-muted/60",
              )}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect?.();
                setOpen(false);
              }}
              role="menuitem"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
