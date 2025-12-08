import * as react_jsx_runtime from "react/jsx-runtime";
import * as React$1 from "react";
import React__default from "react";

/**
 * Theme Configuration System
 *
 * This file defines all available themes for the application.
 * Each theme exports CSS custom properties that Tailwind consumes.
 */
type ThemeName =
  | "dark-glassy"
  | "cyber-neon"
  | "midnight"
  | "dracula"
  | "monokai-dark"
  | "night-owl"
  | "synthwave-84"
  | "tokyo-night"
  | "sublime-material"
  | "cyberpunk-2077"
  | "blade-runner";
interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  glass: string;
  glassLight: string;
  glassDark: string;
  glowPrimary: string;
  glowSecondary: string;
  glowAccent: string;
}
/**
 * Dark Glassy Theme - Modern 2025 Design
 *
 * Features:
 * - Deep navy/slate base for contrast
 * - Frosted glass effect (backdrop blur + semi-transparent)
 * - Subtle glows and gradients
 * - Minimal yet sophisticated
 * - Optimized for readability and modern aesthetics
 */
declare const darkGlassyTheme: ThemeColors;
/**
 * Cyber Neon Theme - High contrast, cyberpunk vibes
 *
 * Features:
 * - Pure black background
 * - Bright neon colors with high contrast
 * - Bold, energetic aesthetic
 * - Maximum readability
 */
declare const cyberNeonTheme: ThemeColors;
/**
 * Midnight Theme - Deep, sophisticated dark theme
 *
 * Features:
 * - Deep indigo background
 * - Muted but warm color palette
 * - Professional, calm aesthetic
 * - Excellent for extended reading
 */
declare const midnightTheme: ThemeColors;
/**
 * Dracula Theme - Popular dark theme with purples and pinks
 *
 * Features:
 * - Dark background with purple tones
 * - Pink and purple accents
 * - Comfortable for extended coding sessions
 */
declare const draculaTheme: ThemeColors;
/**
 * Monokai Dark Theme - Classic code editor theme
 *
 * Features:
 * - Black background
 * - Vibrant, contrasting colors
 * - Popular among developers
 */
declare const monokaiDarkTheme: ThemeColors;
/**
 * Night Owl Theme - Popular VS Code theme with blues and purples
 *
 * Features:
 * - Deep blue/purple background
 * - Soft, warm accents
 * - Designed for late night coding
 */
declare const nightOwlTheme: ThemeColors;
/**
 * Synthwave '84 Theme - Retro 80s aesthetic with neon colors
 *
 * Features:
 * - Dark background with purple/pink tones
 * - Bright neon colors
 * - Retro synthwave vibe
 */
declare const synthwave84Theme: ThemeColors;
/**
 * Tokyo Night Theme - Beautiful Japanese-inspired dark theme
 *
 * Features:
 * - Deep blue background
 * - Soft, complementary colors
 * - Elegant and refined
 */
declare const tokyoNightTheme: ThemeColors;
/**
 * Sublime Material Theme - Material Design inspired
 *
 * Features:
 * - Dark slate background
 * - Material design colors
 * - Professional and polished
 */
declare const sublimeMaterialTheme: ThemeColors;
/**
 * Cyberpunk 2077 Theme - High contrast neon theme inspired by the game
 *
 * Features:
 * - Black background
 * - Bright neon pink and cyan
 * - Maximum contrast for cyberpunk aesthetic
 */
declare const cyberpunk2077Theme: ThemeColors;
/**
 * Blade Runner Theme - Retro futuristic theme inspired by Blade Runner
 *
 * Features:
 * - Dark with green and amber tones
 * - Retro-futuristic aesthetic
 * - CRT monitor inspired
 */
declare const bladeRunnerTheme: ThemeColors;
declare const themes: Record<ThemeName, ThemeColors>;
/**
 * Convert theme colors to CSS custom properties
 */
declare function themeToCSSVars(theme: ThemeColors): Record<string, string>;
/**
 * Get theme by name
 */
declare function getTheme(name: ThemeName): ThemeColors;

interface ThemeContextValue {
  customTheme: ThemeName;
  setCustomTheme: (theme: ThemeName) => void;
}
declare function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useTheme(): ThemeContextValue;

declare function ThemeSwitcher(): react_jsx_runtime.JSX.Element;

/**
 * Theme Utility Hooks and Helpers
 *
 * Provides convenient utilities for building theme-aware components
 */

/**
 * Get a CSS variable value (for runtime usage)
 *
 * @example
 * const primaryColor = getCSSVar('--primary');
 */
declare function getCSSVar(varName: string): string;
/**
 * Conditionally apply Tailwind classes based on theme
 *
 * @example
 * const bgClass = useThemeClass(
 *   { "dark-glassy": "bg-glass-glow" },
 *   "bg-card"
 * );
 */
declare function useThemeClass(
  themeClasses: Partial<Record<ThemeName, string>>,
  defaultClass?: string,
): string;
/**
 * Predefined glass effect variants
 */
declare const glassVariants: {
  readonly standard: "glass";
  readonly elevated: "glass-elevated";
  readonly glow: "glass-glow";
};
/**
 * Predefined glow effect variants
 */
declare const glowVariants: {
  readonly primary: "glow-primary";
  readonly secondary: "glow-secondary";
  readonly accent: "glow-accent";
  readonly sm: "glow-sm";
  readonly lg: "glow-lg";
};
/**
 * Predefined animation variants
 */
declare const animationVariants: {
  readonly fadeIn: "animate-fade-in";
  readonly in: "animate-in";
  readonly pulse: "animate-glow-pulse";
  readonly float: "animate-float";
};
/**
 * Merge theme classes (useful for component composition)
 *
 * @example
 * const buttonClass = mergeThemeClasses(
 *   "px-4 py-2 rounded-lg",
 *   "bg-primary text-primary-foreground"
 * );
 */
declare function mergeThemeClasses(...classes: (string | undefined)[]): string;
/**
 * Create a themed component wrapper
 *
 * @example
 * const ThemedCard = createThemedComponent({
 *   base: "glass p-6 rounded-xl",
 *   "dark-glassy": "glow-primary"
 * });
 */
declare function createThemedComponent(
  classes: {
    base: string;
  } & Partial<Record<ThemeName, string>>,
): string;

interface ButtonProps
  extends React__default.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "glass";
  /** Size of the button */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Add glow effect on hover */
  glow?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to show on the left */
  leftIcon?: React__default.ReactNode;
  /** Icon to show on the right */
  rightIcon?: React__default.ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
  /** Render as a different element (for use with links) */
  asChild?: boolean;
}
/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading state, icons, and glass effects.
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click me</Button>
 *
 * // Glass button with glow
 * <Button variant="glass" glow>Glassy</Button>
 *
 * // Loading state
 * <Button loading>Submitting...</Button>
 *
 * // With icons
 * <Button leftIcon={<PlusIcon />}>Add Item</Button>
 */
declare const Button: React__default.ForwardRefExoticComponent<
  ButtonProps & React__default.RefAttributes<HTMLButtonElement>
>;
/**
 * IconButton Component
 *
 * A square button designed for icon-only usage.
 */
interface IconButtonProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  /** The icon to display */
  icon: React__default.ReactNode;
  /** Accessible label for screen readers */
  "aria-label": string;
}
declare const IconButton: React__default.ForwardRefExoticComponent<
  IconButtonProps & React__default.RefAttributes<HTMLButtonElement>
>;

interface BadgeProps extends React__default.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "error"
    | "info";
  /** Size of the badge */
  size?: "sm" | "md" | "lg";
  /** Show a status dot */
  dot?: boolean;
  /** Add glow effect */
  glow?: boolean;
  /** Make the badge pill-shaped (more rounded) */
  pill?: boolean;
}
/**
 * Badge Component
 *
 * A small status indicator with various styles and optional dot/glow effects.
 *
 * @example
 * // Basic badge
 * <Badge>New</Badge>
 *
 * // Status badge with dot
 * <Badge variant="success" dot>Online</Badge>
 *
 * // Warning badge with glow
 * <Badge variant="warning" glow>Pending</Badge>
 *
 * // Pill-shaped badge
 * <Badge variant="info" pill>Beta</Badge>
 */
declare const Badge: React__default.ForwardRefExoticComponent<
  BadgeProps & React__default.RefAttributes<HTMLSpanElement>
>;
/**
 * NotificationBadge Component
 *
 * A badge designed to show notification counts, typically positioned over an icon.
 */
interface NotificationBadgeProps {
  /** The count to display (shows max value with + if exceeded) */
  count?: number;
  /** Maximum count to show before displaying "max+" */
  max?: number;
  /** Show as a simple dot instead of count */
  dot?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional classes */
  className?: string;
}
declare const NotificationBadge: React__default.ForwardRefExoticComponent<
  NotificationBadgeProps & React__default.RefAttributes<HTMLSpanElement>
>;

interface AvatarProps extends React__default.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback text (initials) or element when image fails */
  fallback?: string | React__default.ReactNode;
  /** Size of the avatar */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Shape of the avatar */
  shape?: "circle" | "square";
  /** Online status indicator */
  status?: "online" | "offline" | "away" | "busy";
  /** Border style */
  bordered?: boolean;
  /** Add glow effect */
  glow?: boolean;
}
/**
 * Avatar Component
 *
 * Displays a user avatar with support for images, initials fallback,
 * and status indicators.
 *
 * @example
 * // With image
 * <Avatar src="/avatar.jpg" alt="John Doe" />
 *
 * // With initials fallback
 * <Avatar fallback="JD" />
 *
 * // With status
 * <Avatar src="/avatar.jpg" status="online" />
 *
 * // Custom size and shape
 * <Avatar size="xl" shape="square" fallback="AB" />
 */
declare const Avatar: React__default.ForwardRefExoticComponent<
  AvatarProps & React__default.RefAttributes<HTMLDivElement>
>;
/**
 * AvatarGroup Component
 *
 * Displays multiple avatars in a stacked layout.
 */
interface AvatarGroupProps
  extends React__default.HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars to show before "+X" indicator */
  max?: number;
  /** Size for all avatars */
  size?: AvatarProps["size"];
  /** Children should be Avatar components */
  children: React__default.ReactNode;
}
declare const AvatarGroup: React__default.ForwardRefExoticComponent<
  AvatarGroupProps & React__default.RefAttributes<HTMLDivElement>
>;

interface SeparatorProps extends React__default.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the separator */
  orientation?: "horizontal" | "vertical";
  /** Whether it's purely decorative (affects accessibility) */
  decorative?: boolean;
  /** Add glow effect */
  glow?: boolean;
  /** Visual variant */
  variant?: "default" | "dashed" | "dotted" | "gradient";
  /** Size (thickness) */
  size?: "sm" | "md" | "lg";
  /** Label text to show in the middle */
  label?: string;
}
/**
 * Separator Component
 *
 * A visual divider for separating content sections.
 *
 * @example
 * // Basic horizontal separator
 * <Separator />
 *
 * // Vertical separator
 * <Separator orientation="vertical" />
 *
 * // With gradient effect
 * <Separator variant="gradient" />
 *
 * // With label
 * <Separator label="Or continue with" />
 *
 * // With glow effect
 * <Separator glow />
 */
declare const Separator: React__default.ForwardRefExoticComponent<
  SeparatorProps & React__default.RefAttributes<HTMLDivElement>
>;

interface LabelProps
  extends React__default.LabelHTMLAttributes<HTMLLabelElement> {
  /** Show a required indicator. If you pass a React node, it will render that instead of the default asterisk. */
  requiredIndicator?: boolean | React__default.ReactNode;
  /** Optional helper text to show alongside the label (e.g., "Optional"). */
  optionalText?: React__default.ReactNode;
}
/**
 * Label
 *
 * Accessible label with optional required and optional indicators.
 */
declare const Label: React__default.ForwardRefExoticComponent<
  LabelProps & React__default.RefAttributes<HTMLLabelElement>
>;

type FieldState$2 = "default" | "error" | "success" | "warning";
type FieldVariant$2 = "default" | "ghost" | "glass";
interface InputProps
  extends React__default.InputHTMLAttributes<HTMLInputElement> {
  /** Visual state to communicate validation */
  state?: FieldState$2;
  /** Styling variant */
  variant?: FieldVariant$2;
  /** Set false to allow intrinsic width */
  fullWidth?: boolean;
}
/**
 * Input
 *
 * Styled input field with variants and validation states.
 */
declare const Input: React__default.ForwardRefExoticComponent<
  InputProps & React__default.RefAttributes<HTMLInputElement>
>;

type FieldState$1 = "default" | "error" | "success" | "warning";
type FieldVariant$1 = "default" | "ghost" | "glass";
interface TextareaProps
  extends React__default.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: FieldState$1;
  variant?: FieldVariant$1;
  fullWidth?: boolean;
  /** Disable resize handles */
  noResize?: boolean;
}
/**
 * Textarea
 *
 * Styled textarea with variants, states, and optional resize disabling.
 */
declare const Textarea: React__default.ForwardRefExoticComponent<
  TextareaProps & React__default.RefAttributes<HTMLTextAreaElement>
>;

type FieldState = "default" | "error" | "success" | "warning";
type FieldVariant = "default" | "ghost" | "glass";
interface SelectProps
  extends React__default.SelectHTMLAttributes<HTMLSelectElement> {
  state?: FieldState;
  variant?: FieldVariant;
  fullWidth?: boolean;
}
/**
 * Select
 *
 * Styled native select with custom chevron and validation states.
 */
declare const Select: React__default.ForwardRefExoticComponent<
  SelectProps & React__default.RefAttributes<HTMLSelectElement>
>;

interface CheckboxProps
  extends Omit<React__default.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Render an indeterminate state (visually a dash). */
  indeterminate?: boolean;
}
/**
 * Checkbox
 *
 * Styled checkbox supporting indeterminate state.
 */
declare const Checkbox: React__default.ForwardRefExoticComponent<
  CheckboxProps & React__default.RefAttributes<HTMLInputElement>
>;

type RadioProps = Omit<
  React__default.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;
/**
 * Radio
 *
 * Styled radio button.
 */
declare const Radio: React__default.ForwardRefExoticComponent<
  RadioProps & React__default.RefAttributes<HTMLInputElement>
>;

interface SwitchProps
  extends Omit<
    React__default.ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange"
  > {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: "sm" | "md";
}
/**
 * Switch
 *
 * Accessible toggle switch component.
 */
declare const Switch: React__default.ForwardRefExoticComponent<
  SwitchProps & React__default.RefAttributes<HTMLButtonElement>
>;

interface SliderProps
  extends Omit<React__default.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Show a value bubble above the thumb */
  showValue?: boolean;
  /** Optional formatter for the displayed value */
  formatValue?: (value: number) => string;
}
/**
 * Slider
 *
 * Styled range input with optional inline value display.
 */
declare const Slider: React__default.ForwardRefExoticComponent<
  SliderProps & React__default.RefAttributes<HTMLInputElement>
>;

interface FormFieldProps {
  label?: React__default.ReactNode;
  htmlFor?: string;
  required?: boolean;
  description?: React__default.ReactNode;
  hint?: React__default.ReactNode;
  error?: React__default.ReactNode;
  /**
   * Layout direction. Horizontal pairs label/description to the left of the control.
   */
  layout?: "vertical" | "horizontal";
  /** Secondary content next to the label (e.g., action link, badge). */
  labelAside?: React__default.ReactNode;
  children: React__default.ReactNode;
  className?: string;
}
/**
 * FormField
 *
 * Layout helper for form controls with label, description, and error messaging.
 */
declare function FormField({
  label,
  htmlFor,
  required,
  description,
  hint,
  error,
  layout,
  labelAside,
  children,
  className,
}: FormFieldProps): react_jsx_runtime.JSX.Element;

/**
 * useLocalStorage Hook
 *
 * Provides persistent state storage using localStorage with SSR safety.
 * Automatically serializes/deserializes JSON values.
 *
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 *
 * @example
 * const [name, setName, removeName] = useLocalStorage('user-name', 'Guest');
 */
declare function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void];
/**
 * Type-safe helper to check if localStorage is available
 */
declare function isLocalStorageAvailable(): boolean;

interface CookieOptions {
  /** Max age in seconds (default: 1 year) */
  maxAge?: number;
  /** Expiration date */
  expires?: Date;
  /** Cookie path (default: '/') */
  path?: string;
  /** Cookie domain */
  domain?: string;
  /** Secure flag (default: true in production) */
  secure?: boolean;
  /** SameSite attribute (default: 'lax') */
  sameSite?: "strict" | "lax" | "none";
}
/**
 * Parse a cookie value from the document.cookie string
 */
declare function getCookie(name: string): string | null;
/**
 * Set a cookie with the given name, value, and options
 */
declare function setCookie(
  name: string,
  value: string,
  options?: CookieOptions,
): void;
/**
 * Delete a cookie by setting its max-age to 0
 */
declare function deleteCookie(name: string, options?: CookieOptions): void;
/**
 * useCookieStorage Hook
 *
 * Provides persistent state storage using cookies with SSR safety.
 * Useful for preferences that need to be read server-side.
 *
 * @param key - The cookie name
 * @param initialValue - Default value if cookie doesn't exist
 * @param options - Cookie options (maxAge, path, domain, secure, sameSite)
 * @returns Tuple of [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme] = useCookieStorage('preferred-theme', 'dark');
 */
declare function useCookieStorage<T>(
  key: string,
  initialValue: T,
  options?: CookieOptions,
): [T, (value: T | ((prev: T) => T)) => void, () => void];

/**
 * useMediaQuery Hook
 *
 * Reactive hook that tracks whether a CSS media query matches.
 * SSR-safe with a default value option.
 *
 * @param query - CSS media query string
 * @param defaultValue - Default value for SSR (default: false)
 * @returns Whether the media query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 */
declare function useMediaQuery(query: string, defaultValue?: boolean): boolean;
/**
 * Predefined breakpoint hooks following Tailwind defaults
 */
declare function useIsMobile(): boolean;
declare function useIsTablet(): boolean;
declare function useIsDesktop(): boolean;
declare function useIsLargeDesktop(): boolean;
/**
 * Tailwind breakpoint hooks
 */
declare function useBreakpoint(
  breakpoint: "sm" | "md" | "lg" | "xl" | "2xl",
): boolean;
/**
 * System preference hooks
 */
declare function usePrefersReducedMotion(): boolean;
declare function usePrefersDarkMode(): boolean;
declare function usePrefersHighContrast(): boolean;

/**
 * Available programming languages for code blocks
 */
declare const CODE_LANGUAGES: readonly [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "java",
  "csharp",
  "cpp",
  "c",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "scala",
  "shell",
  "bash",
  "powershell",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "graphql",
];
type CodeLanguage = (typeof CODE_LANGUAGES)[number];
/**
 * Language display names for UI
 */
declare const LANGUAGE_LABELS: Record<CodeLanguage, string>;
/**
 * Language file extensions
 */
declare const LANGUAGE_EXTENSIONS: Record<CodeLanguage, string>;
interface CodeLanguageContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: readonly string[];
  getLabel: (lang: string) => string;
  getExtension: (lang: string) => string;
}
/**
 * CodeLanguageProvider
 *
 * Provides global code language preference state.
 * Wrap your app with this provider to enable language persistence across all CodeTabs.
 *
 * @example
 * <CodeLanguageProvider defaultLanguage="typescript">
 *   <App />
 * </CodeLanguageProvider>
 */
declare function CodeLanguageProvider({
  children,
  defaultLanguage,
}: {
  children: React.ReactNode;
  defaultLanguage?: string;
}): React$1.FunctionComponentElement<
  React$1.ProviderProps<CodeLanguageContextValue | null>
>;
/**
 * useCodeLanguage Hook
 *
 * Access and modify the global code language preference.
 * Must be used within a CodeLanguageProvider.
 *
 * @returns Object with language, setLanguage, and helper functions
 *
 * @example
 * const { language, setLanguage, getLabel } = useCodeLanguage();
 *
 * // Get display name
 * getLabel('typescript') // => "TypeScript"
 *
 * // Change language (persists and syncs across all components)
 * setLanguage('python')
 */
declare function useCodeLanguage(): CodeLanguageContextValue;
/**
 * Standalone hook for reading code language without provider
 * Useful for isolated components that don't need global state
 */
declare function useCodeLanguageLocal(defaultLanguage?: string): {
  language: string;
  setLanguage: (lang: string) => void;
};

type ContainerWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
interface ContainerProps extends React__default.HTMLAttributes<HTMLDivElement> {
  /** Maximum width breakpoint */
  maxWidth?: ContainerWidth;
  /** Apply horizontal padding */
  padded?: boolean;
  /** Center the container (default true) */
  center?: boolean;
}
/**
 * Container
 *
 * Constrains content to a max width with optional padding and centering.
 */
declare function Container({
  className,
  maxWidth,
  padded,
  center,
  ...props
}: ContainerProps): react_jsx_runtime.JSX.Element;

interface SectionProps
  extends Omit<React__default.HTMLAttributes<HTMLElement>, "title"> {
  title?: React__default.ReactNode;
  description?: React__default.ReactNode;
  eyebrow?: React__default.ReactNode;
  actions?: React__default.ReactNode;
  maxWidth?: ContainerWidth;
  padded?: boolean;
  background?: "none" | "card" | "glass";
  spacing?: "sm" | "md" | "lg";
}
/**
 * Section
 *
 * A semantic section wrapper with optional heading, description, actions, and background.
 */
declare function Section({
  className,
  title,
  description,
  eyebrow,
  actions,
  maxWidth,
  padded,
  background,
  spacing,
  children,
  ...props
}: SectionProps): react_jsx_runtime.JSX.Element;

interface StackProps extends React__default.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  gap?: number | string;
  align?: React__default.CSSProperties["alignItems"];
  justify?: React__default.CSSProperties["justifyContent"];
  wrap?: boolean;
}
/**
 * Stack
 *
 * A simple flex stack with configurable direction, gap, alignment, and wrapping.
 */
declare function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  style,
  ...props
}: StackProps): react_jsx_runtime.JSX.Element;

type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type ResponsiveCols = {
  base?: GridSpan;
  sm?: GridSpan;
  md?: GridSpan;
  lg?: GridSpan;
  xl?: GridSpan;
};
interface GridProps extends React__default.HTMLAttributes<HTMLDivElement> {
  cols?: ResponsiveCols | GridSpan;
  gap?: number | string;
  equalHeight?: boolean;
}
/**
 * Grid
 *
 * Responsive CSS grid with shorthand for breakpoint column counts.
 */
declare function Grid({
  className,
  cols,
  gap,
  equalHeight,
  style,
  children,
  ...props
}: GridProps): react_jsx_runtime.JSX.Element;

interface DividerProps extends React__default.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: React__default.ReactNode;
  variant?: "muted" | "strong" | "glow";
}
/**
 * Divider
 *
 * A horizontal or vertical separator with optional centered label.
 */
declare function Divider({
  className,
  orientation,
  label,
  variant,
  ...props
}: DividerProps): react_jsx_runtime.JSX.Element;

export {
  Avatar,
  AvatarGroup,
  type AvatarGroupProps,
  type AvatarProps,
  Badge,
  type BadgeProps,
  Button,
  type ButtonProps,
  CODE_LANGUAGES,
  Checkbox,
  type CheckboxProps,
  type CodeLanguage,
  CodeLanguageProvider,
  Container,
  type ContainerProps,
  type ContainerWidth,
  type CookieOptions,
  Divider,
  type DividerProps,
  FormField,
  type FormFieldProps,
  Grid,
  type GridProps,
  IconButton,
  type IconButtonProps,
  Input,
  type InputProps,
  LANGUAGE_EXTENSIONS,
  LANGUAGE_LABELS,
  Label,
  type LabelProps,
  NotificationBadge,
  type NotificationBadgeProps,
  Radio,
  type RadioProps,
  Section,
  type SectionProps,
  Select,
  type SelectProps,
  Separator,
  type SeparatorProps,
  Slider,
  type SliderProps,
  Stack,
  type StackProps,
  Switch,
  type SwitchProps,
  Textarea,
  type TextareaProps,
  type ThemeColors,
  type ThemeName,
  ThemeProvider,
  ThemeSwitcher,
  animationVariants,
  bladeRunnerTheme,
  createThemedComponent,
  cyberNeonTheme,
  cyberpunk2077Theme,
  darkGlassyTheme,
  deleteCookie,
  draculaTheme,
  getCSSVar,
  getCookie,
  getTheme,
  glassVariants,
  glowVariants,
  isLocalStorageAvailable,
  mergeThemeClasses,
  midnightTheme,
  monokaiDarkTheme,
  nightOwlTheme,
  setCookie,
  sublimeMaterialTheme,
  synthwave84Theme,
  themeToCSSVars,
  themes,
  tokyoNightTheme,
  useBreakpoint,
  useCodeLanguage,
  useCodeLanguageLocal,
  useCookieStorage,
  useIsDesktop,
  useIsLargeDesktop,
  useIsMobile,
  useIsTablet,
  useLocalStorage,
  useMediaQuery,
  usePrefersDarkMode,
  usePrefersHighContrast,
  usePrefersReducedMotion,
  useTheme,
  useThemeClass,
};
