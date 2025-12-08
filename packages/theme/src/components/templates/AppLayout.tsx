import React from "react";
import { cn } from "../../utils/cn";

const paddingMap = {
  none: "px-0",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
};

const widthMap = {
  full: "max-w-full",
  wide: "max-w-6xl",
  xl: "max-w-7xl",
};

export interface AppLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  contentWidth?: keyof typeof widthMap;
  padding?: keyof typeof paddingMap;
  stickySidebar?: boolean;
}

export function AppLayout({
  className,
  header,
  sidebar,
  footer,
  children,
  contentWidth = "xl",
  padding = "lg",
  stickySidebar = true,
  ...props
}: AppLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground",
        "bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.06),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.06),transparent_25%)]",
        className,
      )}
      {...props}
    >
      {header && (
        <header className="sticky top-0 z-20 border-b border-border/60 bg-card/80 backdrop-blur">
          <div
            className={cn(
              "mx-auto flex h-16 items-center justify-between",
              widthMap[contentWidth],
              paddingMap[padding],
            )}
          >
            {header}
          </div>
        </header>
      )}

      <div
        className={cn(
          "mx-auto w-full py-10",
          widthMap[contentWidth],
          paddingMap[padding],
        )}
      >
        <div
          className={cn(
            "grid gap-8",
            sidebar ? "lg:grid-cols-[260px_1fr]" : "grid-cols-1",
          )}
        >
          {sidebar && (
            <aside
              className={cn(
                "rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm",
                stickySidebar &&
                  "lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto",
              )}
            >
              {sidebar}
            </aside>
          )}

          <main className="space-y-6">{children}</main>
        </div>
      </div>

      {footer && (
        <footer className="border-t border-border/60 bg-card/60">
          <div
            className={cn(
              "mx-auto flex min-h-[72px] items-center justify-between",
              widthMap[contentWidth],
              paddingMap[padding],
            )}
          >
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
