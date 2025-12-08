import React from "react";
import { cn } from "../../utils/cn";

export interface DashboardLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  stats?: React.ReactNode;
}

export function DashboardLayout({
  className,
  title,
  description,
  actions,
  toolbar,
  sidebar,
  footer,
  stats,
  children,
  ...props
}: DashboardLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Overview
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
          {toolbar && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
              {toolbar}
            </div>
          )}
        </div>

        {stats && <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{stats}</div>}

        <div
          className={cn(
            "grid gap-6",
            sidebar ? "lg:grid-cols-[1fr_320px]" : "grid-cols-1",
          )}
        >
          <main className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur">
            <div className="space-y-6">{children}</div>
          </main>

          {sidebar && (
            <aside className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur">
              <div className="space-y-4">{sidebar}</div>
            </aside>
          )}
        </div>

        {footer && (
          <footer className="rounded-3xl border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground shadow-sm backdrop-blur">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
