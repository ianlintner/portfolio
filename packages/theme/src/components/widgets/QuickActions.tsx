import React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../primitives/Button";

export interface QuickAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "glass";
}

export interface QuickActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  actions: QuickAction[];
}

export function QuickActions({
  className,
  actions,
  ...props
}: QuickActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {actions.map((action, idx) => (
        <Button
          key={idx}
          variant={action.variant || "secondary"}
          size="sm"
          onClick={action.onClick}
          leftIcon={action.icon}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
