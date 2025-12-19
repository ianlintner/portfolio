"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "../../utils/cn";

interface TabsContextValue {
  value: string;
  onChange: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs subcomponents must be used within <Tabs>");
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const current = isControlled ? (value as string) : internalValue;

  const context = useMemo<TabsContextValue>(
    () => ({
      value: current,
      onChange: (val: string) => {
        if (!isControlled) setInternalValue(val);
        onValueChange?.(val);
      },
    }),
    [current, isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={cn("flex w-full flex-col gap-3", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabListProps = React.HTMLAttributes<HTMLDivElement>;
export function TabList({ className, ...props }: TabListProps) {
  return (
    <div
      className={cn(
        "inline-flex w-full flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/40 p-1",
        className,
      )}
      role="tablist"
      {...props}
    />
  );
}

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  leftIcon?: React.ReactNode;
}

export function Tab({
  className,
  value,
  leftIcon,
  children,
  ...props
}: TabProps) {
  const { value: active, onChange } = useTabsContext();
  const isActive = active === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onChange(value)}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        "border border-transparent",
        isActive
          ? "bg-background text-foreground shadow-sm border-border"
          : "text-muted-foreground hover:bg-background/50",
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
    </button>
  );
}

export type TabPanelsProps = React.HTMLAttributes<HTMLDivElement>;
export function TabPanels({ className, ...props }: TabPanelsProps) {
  return <div className={cn("w-full", className)} {...props} />;
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabPanel({ className, value, ...props }: TabPanelProps) {
  const { value: active } = useTabsContext();
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      className={cn(
        "rounded-xl border border-border/60 bg-card/50 p-4 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
