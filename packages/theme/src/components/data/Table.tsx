"use client";

import React, { createContext, useContext } from "react";
import { cn } from "../../utils/cn";

type Density = "compact" | "comfortable" | "spacious";

interface TableContextValue {
  padding: string;
  striped: boolean;
  hoverable: boolean;
}

const densityPadding: Record<Density, string> = {
  compact: "px-3 py-2 text-sm",
  comfortable: "px-4 py-3 text-sm",
  spacious: "px-5 py-3.5 text-base",
};

const TableContext = createContext<TableContextValue | null>(null);
const useTableContext = () => {
  const ctx = useContext(TableContext);
  if (!ctx) {
    throw new Error("Table.* components must be used within <Table>");
  }
  return ctx;
};

export interface TableProps extends Omit<
  React.TableHTMLAttributes<HTMLTableElement>,
  "border"
> {
  density?: Density;
  striped?: boolean;
  hoverable?: boolean;
  border?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      children,
      density = "comfortable",
      striped = false,
      hoverable = true,
      border = true,
      ...props
    },
    ref,
  ) => {
    const context: TableContextValue = {
      padding: densityPadding[density],
      striped,
      hoverable,
    };

    return (
      <div className="w-full overflow-x-auto rounded-xl border border-border/60 bg-card/40 shadow-sm">
        <TableContext.Provider value={context}>
          <table
            ref={ref}
            className={cn(
              "w-full border-collapse text-left text-foreground",
              border &&
                "[&_th]:border-b [&_td]:border-b [&_th]:border-border/60 [&_td]:border-border/40",
              className,
            )}
            {...props}
          >
            {children}
          </table>
        </TableContext.Provider>
      </div>
    );
  },
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-muted/40 text-sm uppercase tracking-wide text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-muted/30 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    const { striped, hoverable } = useTableContext();
    return (
      <tr
        ref={ref}
        className={cn(
          striped && "odd:bg-muted/20",
          hoverable && "transition-colors hover:bg-muted/30",
          className,
        )}
        {...props}
      />
    );
  },
);
TableRow.displayName = "TableRow";

type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    const { padding } = useTableContext();
    return (
      <th
        ref={ref}
        className={cn(
          "font-semibold text-muted-foreground",
          padding,
          className,
        )}
        {...props}
      />
    );
  },
);
TableHead.displayName = "TableHead";

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    const { padding } = useTableContext();
    return <td ref={ref} className={cn(padding, className)} {...props} />;
  },
);
TableCell.displayName = "TableCell";

type TableCaptionProps = React.TableHTMLAttributes<HTMLElement>;

export const TableCaption = React.forwardRef<HTMLElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-3 text-left text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
TableCaption.displayName = "TableCaption";
