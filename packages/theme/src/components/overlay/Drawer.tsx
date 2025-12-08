"use client";

import React, { useEffect } from "react";
import { cn } from "../../utils/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const sideClasses: Record<Required<DrawerProps>["side"], string> = {
    left: "left-0 top-0 h-full w-full max-w-md",
    right: "right-0 top-0 h-full w-full max-w-md",
    bottom: "left-0 bottom-0 w-full max-h-[80vh]",
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className={cn(
          "absolute flex flex-col gap-4 border border-border/60 bg-card/90 p-6 shadow-2xl",
          sideClasses[side],
          className,
        )}
      >
        <header className="space-y-1">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
        <div className="flex-1 overflow-auto pr-1">{children}</div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
