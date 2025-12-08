import React from "react";
import { cn } from "../../utils/cn";

export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  illustration?: React.ReactNode;
  footer?: React.ReactNode;
  brand?: React.ReactNode;
}

export function AuthLayout({
  className,
  title,
  subtitle,
  illustration,
  footer,
  brand,
  children,
  ...props
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "grid min-h-screen bg-slate-950 text-foreground lg:grid-cols-[1.1fr_0.9fr]",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-md space-y-8">
          {brand && (
            <div className="text-sm text-muted-foreground">{brand}</div>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
            <div className="space-y-6">{children}</div>
          </div>
          {footer && (
            <div className="text-sm text-muted-foreground">{footer}</div>
          )}
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_20%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.04),transparent_20%)]" />
        <div className="relative flex h-full items-center justify-center p-12 text-slate-100">
          <div className="max-w-lg space-y-4 text-center">
            {illustration ?? (
              <svg
                viewBox="0 0 200 200"
                className="mx-auto h-48 w-48 text-primary/70"
                fill="currentColor"
              >
                <path
                  d="M47.4,-57.2C59.9,-46.9,67.1,-31.9,68.5,-17C69.8,-2.1,65.2,12.8,57.8,25.8C50.3,38.8,40,49.9,27.8,55.9C15.6,61.9,1.5,62.8,-12.7,64.2C-26.8,65.6,-40.9,67.4,-52.5,61.4C-64.1,55.4,-73.2,41.6,-74.7,27.2C-76.2,12.8,-70.1,-2.1,-64.6,-16C-59.2,-29.9,-54.3,-42.8,-44.4,-52.7C-34.5,-62.7,-19.7,-69.8,-3.2,-66.2C13.2,-62.7,26.5,-48.6,47.4,-57.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            )}
            <div className="space-y-2 text-sm leading-relaxed text-slate-200/80">
              <p>
                Secure, elegant authentication screens with thoughtful spacing,
                contrast, and motion-friendly gradients.
              </p>
              <p className="text-slate-300">
                Swap the illustration, add testimonials, or showcase brand
                value—all while keeping the form focused.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
