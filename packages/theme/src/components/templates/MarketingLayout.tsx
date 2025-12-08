import React from "react";
import { cn } from "../../utils/cn";

export interface MarketingLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  navigation?: React.ReactNode;
  hero?: React.ReactNode;
  eyebrow?: React.ReactNode;
  headline?: React.ReactNode;
  subhead?: React.ReactNode;
  cta?: React.ReactNode;
  footer?: React.ReactNode;
}

export function MarketingLayout({
  className,
  navigation,
  hero,
  eyebrow,
  headline,
  subhead,
  cta,
  footer,
  children,
  ...props
}: MarketingLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-slate-950 via-slate-930 to-slate-950 text-foreground",
        className,
      )}
      {...props}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.16),transparent_20%)]" />
        <div className="absolute inset-x-12 top-32 h-64 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 pt-10">
          {navigation && (
            <nav className="flex items-center justify-between rounded-full border border-border/60 bg-slate-900/70 px-4 py-2 text-sm backdrop-blur">
              {navigation}
            </nav>
          )}

          <header className="grid gap-6 text-center">
            <div className="space-y-4">
              {eyebrow && (
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-primary">
                  {eyebrow}
                </div>
              )}
              {headline && (
                <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                  {headline}
                </h1>
              )}
              {subhead && (
                <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                  {subhead}
                </p>
              )}
              {cta && <div className="flex justify-center gap-3">{cta}</div>}
            </div>

            {hero && (
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-slate-900/70 shadow-2xl">
                {hero}
              </div>
            )}
          </header>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl space-y-10 px-6 pb-16">
        {children}
      </main>

      {footer && (
        <footer className="border-t border-border/60 bg-slate-900/70 py-6 text-sm text-muted-foreground">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
