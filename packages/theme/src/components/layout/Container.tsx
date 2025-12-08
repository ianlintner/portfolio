"use client";

import React from "react";
import { cn } from "../../utils/cn";

export type ContainerWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width breakpoint */
  maxWidth?: ContainerWidth;
  /** Apply horizontal padding */
  padded?: boolean;
  /** Center the container (default true) */
  center?: boolean;
}

const widthClasses: Record<ContainerWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

/**
 * Container
 *
 * Constrains content to a max width with optional padding and centering.
 */
export function Container({
  className,
  maxWidth = "xl",
  padded = true,
  center = true,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        widthClasses[maxWidth],
        padded && "px-4 sm:px-6 lg:px-8",
        center && "mx-auto",
        className
      )}
      {...props}
    />
  );
}
