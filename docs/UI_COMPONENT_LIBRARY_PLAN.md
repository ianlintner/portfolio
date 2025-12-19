# UI Component Library Expansion Plan

## Overview

This document outlines a comprehensive plan to expand the `@ianlintner/theme` package from a portfolio-focused theme system into a **full-featured, composable UI component library** suitable for any web application—from marketing sites to complex dashboards.

### Goals

1. **Universal Applicability** - Components work for portfolios, blogs, SaaS apps, dashboards, e-commerce, and more
2. **Composable Design** - Small, focused components that combine into larger patterns
3. **Theme-Aware** - All components respect the existing 11+ theme variants
4. **Accessible** - WCAG 2.1 AA compliant with proper ARIA attributes
5. **Developer Experience** - TypeScript-first, well-documented props, sensible defaults
6. **Zero External Dependencies** - Pure React + Tailwind (except for specific utilities like syntax highlighting)

---

## Current State Analysis

### Existing Components

- `ThemeProvider` - Context provider for theme switching
- `ThemeSwitcher` - Theme selection dropdown
- `ThemeShowcase` - Demo component for theme features

### Existing Utilities

- 11 theme variants (dark-glassy, cyber-neon, midnight, dracula, etc.)
- Glass effect CSS utilities (`.glass`, `.glass-elevated`, `.glass-glow`)
- Glow effect utilities (`.glow-primary`, `.glow-secondary`, `.glow-accent`)
- Animation utilities (`.animate-fade-in`, `.animate-glow-pulse`, `.animate-float`)

### Tailwind Config Features

- HSL-based CSS custom properties
- Semantic color tokens (primary, secondary, muted, accent, destructive)
- Typography plugin integration
- Custom shadows and border radii

---

## Proposed Architecture

```
packages/theme/src/
├── components/
│   ├── primitives/           # Base building blocks
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Separator.tsx
│   │   └── index.ts
│   │
│   ├── forms/                # Form elements
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Switch.tsx
│   │   ├── Slider.tsx
│   │   ├── Label.tsx
│   │   ├── FormField.tsx
│   │   └── index.ts
│   │
│   ├── data-display/         # Data presentation
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── DataGrid.tsx
│   │   ├── List.tsx
│   │   ├── DescriptionList.tsx
│   │   ├── Stat.tsx
│   │   ├── Progress.tsx
│   │   └── index.ts
│   │
│   ├── code/                 # Code presentation
│   │   ├── CodeBlock.tsx
│   │   ├── CodeTabs.tsx
│   │   ├── InlineCode.tsx
│   │   └── index.ts
│   │
│   ├── feedback/             # User feedback
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   ├── Tooltip.tsx
│   │   └── index.ts
│   │
│   ├── overlays/             # Modals & popovers
│   │   ├── Dialog.tsx
│   │   ├── Drawer.tsx
│   │   ├── Popover.tsx
│   │   ├── DropdownMenu.tsx
│   │   └── index.ts
│   │
│   ├── navigation/           # Navigation elements
│   │   ├── Tabs.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── Pagination.tsx
│   │   ├── NavLink.tsx
│   │   └── index.ts
│   │
│   ├── layout/               # Layout containers
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ├── Grid.tsx
│   │   ├── Stack.tsx
│   │   ├── Divider.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   │
│   ├── patterns/             # Composite patterns
│   │   ├── PageHeader.tsx
│   │   ├── PageFooter.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   │
│   ├── widgets/              # Dashboard widgets
│   │   ├── StatCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── QuickActions.tsx
│   │   └── index.ts
│   │
│   ├── templates/            # Page layout templates
│   │   ├── AppLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── MarketingLayout.tsx
│   │   └── index.ts
│   │
│   ├── ThemeProvider.tsx     # (existing)
│   ├── ThemeSwitcher.tsx     # (existing)
│   └── index.ts
│
├── hooks/                    # Utility hooks
│   ├── useCodeLanguage.ts    # Language preference storage
│   ├── useMediaQuery.ts
│   ├── useLocalStorage.ts
│   ├── useCookieStorage.ts
│   └── index.ts
│
├── config/
│   └── themes.ts             # (existing)
│
├── styles/
│   └── globals.css           # (existing, will expand)
│
├── utils/
│   ├── theme.ts              # (existing)
│   ├── cn.ts                 # Class name merge utility
│   └── index.ts
│
└── index.ts                  # Main exports
```

---

## Phase 1: Foundation (Priority: High)

### 1.1 Utility Functions

#### `cn.ts` - Class Name Merger

```typescript
// Combines clsx + tailwind-merge for class composition
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Dependencies to add:**

- `clsx` - Conditional class construction
- `tailwind-merge` - Intelligent Tailwind class merging

### 1.2 Storage Hooks

#### `useLocalStorage.ts`

```typescript
// Persistent storage with SSR safety
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void];
```

#### `useCookieStorage.ts`

```typescript
// Cookie-based storage for server-readable preferences
export function useCookieStorage<T>(
  key: string,
  initialValue: T,
  options?: CookieOptions,
): [T, (value: T) => void];
```

#### `useCodeLanguage.ts`

```typescript
// Manages preferred code language with persistence
export function useCodeLanguage(): {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: string[];
};
```

---

## Phase 2: Primitives (Priority: High)

### 2.1 Button Component

```typescript
interface ButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "glass";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean; // For composition with links
}
```

**Variants:**

- `primary` - Solid primary color with hover glow
- `secondary` - Muted background, subtle hover
- `outline` - Border only, transparent background
- `ghost` - No background, hover reveals subtle fill
- `destructive` - Red/danger styling
- `glass` - Frosted glass effect with backdrop blur

### 2.2 Badge Component

```typescript
interface BadgeProps {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  dot?: boolean; // Show status dot
  glow?: boolean;
}
```

### 2.3 Avatar Component

```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string | React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  shape?: "circle" | "square";
}
```

### 2.4 Separator Component

```typescript
interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  glow?: boolean;
}
```

---

## Phase 3: Form Elements (Priority: High)

### 3.1 Input Component

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "glass" | "filled";
  size?: "sm" | "md" | "lg";
  error?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### 3.2 Textarea Component

```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "glass" | "filled";
  resize?: "none" | "vertical" | "horizontal" | "both";
  autoGrow?: boolean;
  maxRows?: number;
}
```

### 3.3 Select Component

```typescript
interface SelectProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "glass";
  size?: "sm" | "md" | "lg";
  searchable?: boolean;
  multiple?: boolean;
}
```

### 3.4 Checkbox Component

```typescript
interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: boolean;
}
```

### 3.5 Radio Component

```typescript
interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode; // RadioGroupItem components
}

interface RadioGroupItemProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}
```

### 3.6 Switch Component

```typescript
interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  label?: string;
  disabled?: boolean;
}
```

### 3.7 Slider Component

```typescript
interface SliderProps {
  value?: number | number[];
  onChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: Array<{ value: number; label?: string }>;
  showTooltip?: boolean;
  range?: boolean;
}
```

### 3.8 FormField Wrapper

```typescript
interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

---

## Phase 4: Data Display (Priority: High)

### 4.1 Card Component

```typescript
interface CardProps {
  variant?: "default" | "glass" | "glass-elevated" | "glass-glow" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  clickable?: boolean;
  glow?: "primary" | "secondary" | "accent";
}

// Compound components
Card.Header;
Card.Body;
Card.Footer;
Card.Title;
Card.Description;
Card.Media;
```

### 4.2 Table Component

```typescript
interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T | string;
    header: string;
    render?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
  }>;
  variant?: "default" | "glass" | "striped";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
  selectable?: boolean;
  sticky?: boolean; // Sticky header
  loading?: boolean;
  emptyState?: React.ReactNode;
}

// Compound components for custom usage
Table.Root;
Table.Header;
Table.Body;
Table.Row;
Table.Head;
Table.Cell;
```

### 4.3 DataGrid Component (Advanced Table)

```typescript
interface DataGridProps<T> extends TableProps<T> {
  pagination?: {
    pageSize: number;
    pageIndex: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    column: string;
    direction: "asc" | "desc";
    onSort: (column: string, direction: "asc" | "desc") => void;
  };
  filtering?: boolean;
  columnResizing?: boolean;
  virtualScroll?: boolean;
}
```

### 4.4 List Component

```typescript
interface ListProps {
  variant?: "default" | "glass" | "divided";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

interface ListItemProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  title?: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}
```

### 4.5 DescriptionList Component

```typescript
interface DescriptionListProps {
  items: Array<{
    term: string;
    description: React.ReactNode;
  }>;
  layout?: "vertical" | "horizontal";
  variant?: "default" | "glass";
}
```

### 4.6 Stat Component

```typescript
interface StatProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  variant?: "default" | "glass";
  size?: "sm" | "md" | "lg";
}
```

### 4.7 Progress Component

```typescript
interface ProgressProps {
  value: number;
  max?: number;
  variant?: "default" | "gradient" | "striped";
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  showValue?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
}

// Also: ProgressCircle for circular progress
interface ProgressCircleProps extends Omit<ProgressProps, "variant"> {
  strokeWidth?: number;
}
```

---

## Phase 5: Code Display (Priority: High)

### 5.1 CodeBlock Component

```typescript
interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  maxHeight?: string;
  copyable?: boolean;
  variant?: "default" | "glass";
}
```

**Features:**

- Syntax highlighting via `shiki` or `highlight.js`
- Copy to clipboard button
- Line numbers (optional)
- Line highlighting
- Filename header

### 5.2 CodeTabs Component ⭐ (Key Feature)

```typescript
interface CodeTabsProps {
  tabs: Array<{
    language: string;
    label?: string; // Display name (e.g., "TypeScript" vs "ts")
    code: string;
    filename?: string;
  }>;
  defaultLanguage?: string;
  persistPreference?: boolean; // Save to cookie/localStorage
  storageKey?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  variant?: "default" | "glass";
}
```

**Implementation Details:**

```typescript
// useCodeLanguage hook
const STORAGE_KEY = "preferred-code-language";

export function useCodeLanguage() {
  const [language, setLanguageState] = useState<string>("typescript");

  useEffect(() => {
    // Check cookie first (for SSR), then localStorage
    const cookieValue = getCookie(STORAGE_KEY);
    const storageValue = localStorage.getItem(STORAGE_KEY);
    const saved = cookieValue || storageValue;
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    setCookie(STORAGE_KEY, lang, { maxAge: 365 * 24 * 60 * 60 }); // 1 year
  };

  return { language, setLanguage };
}
```

**Behavior:**

1. User visits page → CodeTabs shows last-used language (from cookie/storage)
2. User clicks different language tab → All CodeTabs on page switch to that language
3. Preference persists across sessions via cookie (accessible server-side) and localStorage (fallback)
4. If selected language not available in a specific CodeTabs instance, falls back to first available

### 5.3 InlineCode Component

```typescript
interface InlineCodeProps {
  children: string;
  variant?: "default" | "glass";
}
```

---

## Phase 6: Feedback Components (Priority: Medium)

### 6.1 Spinner Component

```typescript
interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "bars" | "ring" | "pulse";
  color?: "primary" | "secondary" | "current"; // 'current' inherits text color
  label?: string; // Accessibility label
}
```

**Variants:**

- `default` - Classic spinning circle
- `dots` - Three bouncing dots
- `bars` - Audio-style bars
- `ring` - Ring with gradient
- `pulse` - Pulsing circle

### 6.2 Skeleton Component

```typescript
interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
  lines?: number; // For text variant
}

// Preset skeletons
Skeleton.Avatar;
Skeleton.Text;
Skeleton.Button;
Skeleton.Card;
Skeleton.Image;
```

### 6.3 Alert Component

```typescript
interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  icon?: React.ReactNode | boolean; // true = default icon
  closable?: boolean;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### 6.4 Toast Component

```typescript
interface ToastProps {
  variant?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  duration?: number; // Auto-dismiss time in ms
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast provider and hook
export function ToastProvider({ children }: { children: React.ReactNode });
export function useToast(): {
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};
```

### 6.5 Tooltip Component

```typescript
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delay?: number;
  variant?: "default" | "glass";
}
```

---

## Phase 7: Overlays (Priority: Medium)

### 7.1 Dialog Component

```typescript
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

// Compound components
Dialog.Trigger;
Dialog.Content;
Dialog.Header;
Dialog.Title;
Dialog.Description;
Dialog.Body;
Dialog.Footer;
Dialog.Close;
```

### 7.2 Drawer Component

```typescript
interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  children: React.ReactNode;
}

// Same compound components as Dialog
```

### 7.3 Popover Component

```typescript
interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

// Compound components
Popover.Trigger;
Popover.Content;
Popover.Arrow;
Popover.Close;
```

### 7.4 DropdownMenu Component

```typescript
interface DropdownMenuProps {
  children: React.ReactNode;
}

// Compound components
DropdownMenu.Trigger;
DropdownMenu.Content;
DropdownMenu.Item;
DropdownMenu.CheckboxItem;
DropdownMenu.RadioGroup;
DropdownMenu.RadioItem;
DropdownMenu.Separator;
DropdownMenu.Label;
DropdownMenu.Sub;
DropdownMenu.SubTrigger;
DropdownMenu.SubContent;
```

---

## Phase 8: Navigation (Priority: Medium)

### 8.1 Tabs Component

```typescript
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline" | "glass";
  size?: "sm" | "md" | "lg";
}

// Compound components
Tabs.List;
Tabs.Trigger;
Tabs.Content;
```

### 8.2 Breadcrumb Component

```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    icon?: React.ReactNode;
  }>;
  separator?: React.ReactNode;
  maxItems?: number; // Collapse middle items if exceeded
}
```

### 8.3 Pagination Component

```typescript
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number; // Pages to show on each side of current
  boundaries?: number; // Pages to always show at start/end
  showFirst?: boolean;
  showLast?: boolean;
  variant?: "default" | "glass";
  size?: "sm" | "md" | "lg";
}
```

### 8.4 NavLink Component

```typescript
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  variant?: "default" | "pill" | "underline";
  icon?: React.ReactNode;
}
```

---

## Phase 9: Layout Components (Priority: High)

### 9.1 Container Component

```typescript
interface ContainerProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  center?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}
```

### 9.2 Section Component

```typescript
interface SectionProps {
  variant?: "default" | "glass" | "muted" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

### 9.3 Grid Component

```typescript
interface GridProps {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

// GridItem for spanning
interface GridItemProps {
  colSpan?: number | { sm?: number; md?: number; lg?: number };
  rowSpan?: number;
}
```

### 9.4 Stack Component

```typescript
interface StackProps {
  direction?:
    | "row"
    | "column"
    | { sm?: "row" | "column"; md?: "row" | "column" };
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  children: React.ReactNode;
}
```

### 9.5 Divider Component

```typescript
interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted" | "gradient";
  label?: string; // Text in middle of divider
  glow?: boolean;
}
```

### 9.6 Sidebar Component

```typescript
interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  position?: "left" | "right";
  variant?: "default" | "glass";
  width?: string;
  collapsedWidth?: string;
  children: React.ReactNode;
}

// Compound components
Sidebar.Header;
Sidebar.Content;
Sidebar.Footer;
Sidebar.Nav;
Sidebar.NavItem;
Sidebar.NavGroup;
Sidebar.CollapseButton;
```

---

## Phase 10: Patterns (Priority: Medium)

### 10.1 PageHeader Component

```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbProps["items"];
  actions?: React.ReactNode;
  tabs?: TabsProps;
  variant?: "default" | "glass";
}
```

### 10.2 PageFooter Component

```typescript
interface PageFooterProps {
  children: React.ReactNode;
  variant?: "default" | "glass" | "minimal";
  sticky?: boolean;
}
```

### 10.3 EmptyState Component

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
  };
  variant?: "default" | "glass";
}
```

### 10.4 ErrorBoundary Component

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?:
    | React.ReactNode
    | ((error: Error, reset: () => void) => React.ReactNode);
}
```

---

## Phase 11: Widgets (Priority: Medium)

### 11.1 StatCard Widget

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string; // e.g., "vs last week"
  };
  icon?: React.ReactNode;
  chart?: React.ReactNode; // Mini sparkline
  variant?: "default" | "glass";
  trend?: "up" | "down" | "neutral";
}
```

### 11.2 ChartCard Widget

```typescript
interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode; // Chart component
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  variant?: "default" | "glass";
}
```

### 11.3 ActivityFeed Widget

```typescript
interface ActivityFeedProps {
  items: Array<{
    id: string;
    avatar?: string;
    user: string;
    action: string;
    target?: string;
    timestamp: Date | string;
    icon?: React.ReactNode;
  }>;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  variant?: "default" | "glass";
}
```

### 11.4 QuickActions Widget

```typescript
interface QuickActionsProps {
  actions: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: "default" | "primary" | "secondary";
  }>;
  columns?: 2 | 3 | 4;
  variant?: "default" | "glass";
}
```

---

## Phase 12: Templates (Priority: Low)

### 12.1 AppLayout Template

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
```

Basic app shell with optional sidebar, header, and footer.

### 12.2 DashboardLayout Template

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  sidebarCollapsible?: boolean;
}
```

Dashboard-specific layout with collapsible sidebar and header actions.

### 12.3 AuthLayout Template

```typescript
interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "centered" | "split";
  logo?: React.ReactNode;
  backgroundImage?: string;
}
```

Authentication pages (login, register, forgot password).

### 12.4 MarketingLayout Template

```typescript
interface MarketingLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  floatingNav?: boolean;
}
```

Marketing/landing page layout with floating navigation option.

---

## Phase 13: Animations & Transitions

### New CSS Animation Classes

```css
/* Entrances */
.animate-fade-in {
}
.animate-fade-in-up {
}
.animate-fade-in-down {
}
.animate-slide-in-left {
}
.animate-slide-in-right {
}
.animate-scale-in {
}
.animate-bounce-in {
}

/* Attention */
.animate-pulse {
}
.animate-bounce {
}
.animate-shake {
}
.animate-wiggle {
}

/* Special Effects */
.animate-glow-pulse {
} /* existing */
.animate-float {
} /* existing */
.animate-shimmer {
}
.animate-gradient {
}

/* Spinners */
.animate-spin {
}
.animate-spin-slow {
}
.animate-ping {
}
```

### Tailwind Animation Extensions

```typescript
// tailwind.config.ts additions
animation: {
  'fade-in': 'fadeIn 0.3s ease-out',
  'fade-in-up': 'fadeInUp 0.4s ease-out',
  'fade-in-down': 'fadeInDown 0.4s ease-out',
  'slide-in-left': 'slideInLeft 0.3s ease-out',
  'slide-in-right': 'slideInRight 0.3s ease-out',
  'scale-in': 'scaleIn 0.2s ease-out',
  'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'shimmer': 'shimmer 2s linear infinite',
  'gradient': 'gradient 3s ease infinite',
  'glow-pulse': 'glowPulse 2s ease-in-out infinite',
  'float': 'float 3s ease-in-out infinite',
},
keyframes: {
  fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
  fadeInUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
  // ... etc
}
```

---

## Implementation Priority Order

### Sprint 1 (Week 1-2): Foundation + Core

1. ✅ Utility functions (`cn.ts`, storage hooks)
2. ✅ Button, Badge, Avatar, Separator
3. ✅ Input, Textarea, Select, Checkbox, Radio, Switch, Label
4. ✅ Card (with compound components)
5. ✅ Container, Section, Stack, Grid

### Sprint 2 (Week 3-4): Data & Code

1. ✅ Table (basic + compound)
2. ✅ List, DescriptionList, Stat, Progress
3. ✅ CodeBlock, CodeTabs (with language persistence)
4. ✅ InlineCode

### Sprint 3 (Week 5-6): Feedback & Navigation

1. ✅ Spinner, Skeleton, Alert
2. ✅ Toast (with provider)
3. ✅ Tooltip
4. ✅ Tabs, Breadcrumb, Pagination

### Sprint 4 (Week 7-8): Overlays & Layout

1. ✅ Dialog, Drawer
2. ✅ Popover, DropdownMenu
3. ✅ Sidebar
4. ✅ Divider

### Sprint 5 (Week 9-10): Patterns & Widgets

1. ✅ PageHeader, PageFooter, EmptyState
2. ✅ StatCard, ChartCard, ActivityFeed, QuickActions
3. ✅ Additional animations

### Sprint 6 (Week 11-12): Templates & Polish

1. ✅ AppLayout, DashboardLayout, AuthLayout, MarketingLayout
2. ✅ Documentation site/showcase
3. ✅ Unit tests
4. ✅ Accessibility audit

---

## Dependencies to Add

```json
{
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "tailwindcss": "^3.0.0"
  },
  "optionalDependencies": {
    "shiki": "^1.0.0" // For advanced syntax highlighting
  }
}
```

---

## Export Strategy

```typescript
// packages/theme/src/index.ts

// Config & Utils
export * from "./config/themes";
export * from "./utils/cn";
export * from "./utils/theme";

// Hooks
export * from "./hooks/useCodeLanguage";
export * from "./hooks/useLocalStorage";
export * from "./hooks/useCookieStorage";
export * from "./hooks/useMediaQuery";

// Theme System
export * from "./components/ThemeProvider";
export * from "./components/ThemeSwitcher";

// Primitives
export * from "./components/primitives";

// Forms
export * from "./components/forms";

// Data Display
export * from "./components/data-display";

// Code
export * from "./components/code";

// Feedback
export * from "./components/feedback";

// Overlays
export * from "./components/overlays";

// Navigation
export * from "./components/navigation";

// Layout
export * from "./components/layout";

// Patterns
export * from "./components/patterns";

// Widgets
export * from "./components/widgets";

// Templates
export * from "./components/templates";
```

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

- Each component has basic render test
- Interactive components have user event tests
- Accessibility tests with `jest-axe`

### Visual Regression (Optional)

- Storybook + Chromatic for visual testing
- Snapshot tests for static components

### Integration Tests

- Theme switching affects all components
- CodeTabs language persistence works across components
- Toast system works with multiple toasts

---

## Documentation

### Component Documentation

Each component should have:

1. **Props table** with types and defaults
2. **Usage examples** (basic, advanced, with other components)
3. **Accessibility notes**
4. **Theme customization examples**

### Showcase Page Updates

Extend `ThemeShowcase.tsx` to demonstrate all new components organized by category.

---

## Migration Notes for Existing Portfolio

When updating the main portfolio app to use new components:

1. Replace custom buttons with `<Button>` component
2. Replace manual card styling with `<Card>` compound components
3. Replace custom form inputs with form components
4. Add `CodeTabs` to blog posts for multi-language examples
5. Update layouts to use `Container`, `Section`, `Stack`
6. Add `Toast` provider to root layout

---

## Success Metrics

- [ ] All 60+ components implemented
- [ ] 100% TypeScript coverage
- [ ] All components work with all 11 themes
- [ ] WCAG 2.1 AA compliance verified
- [ ] Bundle size under 50KB gzipped (excluding optional deps)
- [ ] Comprehensive Storybook documentation
- [ ] Zero breaking changes to existing ThemeProvider API
