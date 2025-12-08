"use client";

import React from "react";
import { cn } from "../../utils/cn";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

export function Sidebar({
  className,
  children,
  width = "280px",
  collapsible = false,
  collapsed = false,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col gap-4 border-r border-border/60 bg-card/60 p-4 backdrop-blur",
        collapsible && "transition-[width] duration-300",
        className,
      )}
      style={{ width: collapsed ? "76px" : width }}
      {...props}
    >
      {children}
    </aside>
  );
}

export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 px-2", className)} {...props} />
  );
}

export interface SidebarSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
}

export function SidebarSection({
  className,
  title,
  children,
  ...props
}: SidebarSectionProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {title && (
        <div className="px-2 text-xs font-semibold uppercase text-muted-foreground">
          {title}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
}

export function SidebarItem({
  className,
  icon,
  active = false,
  badge,
  children,
  ...props
}: SidebarItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
      {badge && (
        <span className="shrink-0 text-xs text-muted-foreground">{badge}</span>
      )}
    </button>
  );
}

export type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>;
export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return <div className={cn("mt-auto px-2", className)} {...props} />;
}
