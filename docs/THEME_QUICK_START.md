# Theme System Quick Start

## What's New?

Modern, interchangeable theme system with dark, glassy, minimal 2025 design.

## Key Components

### 1. Theme Configuration (`src/config/themes.ts`)

- Define all available themes
- Central color palette management
- Easy to extend with new themes

### 2. ThemeProvider (`src/components/ThemeProvider.tsx`)

- React Context for theme state
- Manages display theme (light/dark/system)
- Manages custom theme (design theme)
- Auto-persists to localStorage

### 3. ThemeSwitcher (`src/components/ThemeSwitcher.tsx`)

- Pre-built UI for changing themes
- Display mode buttons
- Custom theme selector

## Using in Your Components

### Option 1: Use ThemeSwitcher Directly

```tsx
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Page() {
  return (
    <nav>
      <ThemeSwitcher />
    </nav>
  );
}
```

### Option 2: Access Theme Context

```tsx
"use client";

import { useTheme } from "@/components/ThemeProvider";

export function MyComponent() {
  const { displayTheme, setDisplayTheme, customTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {customTheme}</p>
      <button onClick={() => setDisplayTheme("dark")}>Dark</button>
    </div>
  );
}
```

### Option 3: Use Theme Utilities

```tsx
import { useThemeClass, glassVariants } from "@/utils/theme";

export function MyCard() {
  const bgClass = useThemeClass(
    {
      "dark-glassy": "bg-glass-glow",
    },
    "bg-card",
  );

  return <div className={`${glassVariants.elevated} p-6`}>Content</div>;
}
```

## Tailwind Classes

### Colors

```tsx
<div className="bg-primary">Primary</div>
<div className="bg-secondary">Secondary</div>
<div className="bg-glass">Glass</div>
<div className="text-foreground">Text</div>
```

### Glass Effects

```tsx
<div className="glass">Standard glass</div>
<div className="glass-elevated">Elevated glass</div>
<div className="glass-glow">Glowing glass</div>
```

### Glow Effects

```tsx
<div className="glow-primary">Primary glow</div>
<div className="glow-secondary">Secondary glow</div>
<div className="glow-accent">Accent glow</div>
<div className="glow-sm">Small glow</div>
<div className="glow-lg">Large glow</div>
```

### Animations

```tsx
<div className="animate-glow-pulse">Pulsing</div>
<div className="animate-float">Floating</div>
<div className="animate-fade-in">Fading in</div>
```

## CSS Variables

For custom CSS:

```css
.custom-element {
  background: hsl(var(--primary));
  color: hsl(var(--foreground));
  box-shadow: 0 0 20px hsla(var(--glow-primary), 0.4);
}
```

Available variables:

- `--background`, `--foreground`
- `--primary`, `--secondary`, `--accent`
- `--card`, `--glass`, `--glass-light`, `--glass-dark`
- `--glow-primary`, `--glow-secondary`, `--glow-accent`
- `--ring`, `--border`, `--input`
- `--muted`, `--destructive`

## Adding a New Theme

1. **Define theme in `src/config/themes.ts`:**

```typescript
export const myNewTheme: ThemeColors = {
  background: "210 40% 4%",
  foreground: "210 40% 98%",
  // ... other colors
};

export const themes: Record<ThemeName, ThemeColors> = {
  "dark-glassy": darkGlassyTheme,
  "my-new-theme": myNewTheme, // Add here
};
```

2. **Update type:**

```typescript
export type ThemeName = "dark-glassy" | "my-new-theme";
```

3. **Done!** Theme is immediately selectable.

## File Structure

```
src/
├── app/
│   ├── globals.css          # CSS variables & utilities
│   └── layout.tsx
├── components/
│   ├── ThemeProvider.tsx    # Context provider
│   ├── ThemeSwitcher.tsx    # UI controls
│   └── ThemeShowcase.tsx    # Demo component
├── config/
│   └── themes.ts            # Theme definitions
└── utils/
    └── theme.ts             # Theme utilities & helpers
```

## Documentation

See `docs/THEME_SYSTEM.md` for complete documentation.

## Showcase Component

View all theme features with the showcase:

```tsx
import { ThemeShowcase } from "@/components/ThemeShowcase";

export default function DemoPage() {
  return <ThemeShowcase />;
}
```

## Tips

- **Use semantic classes** - `text-primary` instead of hardcoding colors
- **Glass on dark** - Glass effects work best on dark backgrounds
- **Glow accents** - Add glows to interactive elements
- **Layer effects** - Combine glass + glow for depth
- **Test contrast** - Ensure readability in both light/dark
- **Minimize glows** - Use sparingly for impact

---

**Ready to use!** Add ThemeSwitcher to your Navigation and start theming.
