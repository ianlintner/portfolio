"use client";

import * as React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;
    if (hasError) {
      return (
        fallback || (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive-foreground">
            <div className="text-sm font-semibold">Something went wrong.</div>
            {error?.message && (
              <div className="text-xs opacity-80">{error.message}</div>
            )}
          </div>
        )
      );
    }
    return children;
  }
}
