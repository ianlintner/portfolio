"use client";

import React from "react";
import { cn } from "../../utils/cn";
import { Container, type ContainerWidth } from "./Container";

export interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: ContainerWidth;
  padded?: boolean;
  background?: "none" | "card" | "glass";
  spacing?: "sm" | "md" | "lg";
}

const spacingMap: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
};

const backgroundMap: Record<NonNullable<SectionProps["background"]>, string> = {
  none: "",
  card: "rounded-2xl border border-border/60 bg-card/60 shadow-glow-sm",
  glass: "rounded-2xl glass shadow-glow",
};

/**
 * Section
 *
 * A semantic section wrapper with optional heading, description, actions, and background.
 */
export function Section({
  className,
  title,
  description,
  eyebrow,
  actions,
  maxWidth = "xl",
  padded = true,
  background = "none",
  spacing = "md",
  children,
  ...props
}: SectionProps) {
  const hasHeader = title || description || eyebrow || actions;

  return (
    <section className={cn(spacingMap[spacing], className)} {...props}>
      <Container maxWidth={maxWidth} padded={padded} className="w-full">
        <div className={cn("flex flex-col gap-6", backgroundMap[background])}>
          {hasHeader && (
            <div
              className={cn(
                "flex flex-col gap-3",
                background !== "none" && "p-6",
              )}
            >
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {eyebrow}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="space-y-2">
                  {title && (
                    <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-base text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex shrink-0 items-center gap-3">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={cn(background !== "none" && "p-6 pb-8")}>
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
