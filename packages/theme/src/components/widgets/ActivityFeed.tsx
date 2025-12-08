import React from "react";
import { cn } from "../../utils/cn";

export interface ActivityItem {
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[];
  emptyLabel?: React.ReactNode;
}

export function ActivityFeed({ className, items, emptyLabel = "No activity yet", ...props }: ActivityFeedProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-3 rounded-xl border border-border/60 bg-card/60 p-3">
          <div className="mt-1 h-8 w-8 rounded-full bg-muted/50 text-center text-lg leading-8">
            {item.icon || "•"}
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-sm font-semibold">{item.title}</div>
            {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
            {item.timestamp && <div className="text-xs text-muted-foreground/80">{item.timestamp}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
