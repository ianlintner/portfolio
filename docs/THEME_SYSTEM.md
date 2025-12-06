# Theme System Documentation

## Overview

The portfolio features a modern, interchangeable theme system built with Tailwind CSS. The system separates two concepts:

1. **Display Theme**: Controls light/dark/system mode
2. **Custom Theme**: Selects which design theme to use (e.g., "dark-glassy", future themes)

## Architecture

### Key Files

- **`src/config/themes.ts`** - Theme definitions and color palettes
- **`src/components/ThemeProvider.tsx`** - React context provider for theme state
- **`src/components/ThemeSwitcher.tsx`** - UI controls for theme switching
- **`src/app/globals.css`** - CSS custom properties and glass/glow utilities
- **`tailwind.config.ts`** - Tailwind extensions for glass and glow effects

## Current Theme: Dark Glassy

### Design Philosophy

- **Deep Navy Base**: `#0a0e27` - High contrast, easy on the eyes
- **Frosted Glass**: Semi-transparent backgrounds with 20-30px blur
- **Electric Blue Glow**: `#00b4ff` - Modern, vibrant primary color
- **Minimal & Modern**: Clean spacing, subtle shadows, focus on content
- **2025 Aesthetic**: Contemporary design patterns

### Color Palette

```
Background:    #0a0e27 (Deep Navy)
Foreground:    #F8FAFC (Near White)
Primary:       #00b4ff (Electric Blue)
Secondary:     #334155 (Slate)
Accent:        #b300ff (Purple)
Muted:         #475569 (Slate)
Destructive:   #ef4444 (Red)
Glass:         Semi-transparent navy with blur
```

## Usage

### Using the Theme Context

```tsx
import { useTheme } from "@/components/ThemeProvider";

export function MyComponent() {
  const { displayTheme, setDisplayTheme, customTheme, setCustomTheme } =
    useTheme();

  return (
    <div>
      <button onClick={() => setDisplayTheme("dark")}>Dark Mode</button>
      <select onChange={(e) => setCustomTheme(e.target.value)}>
        {/* Theme options */}
      </select>
    </div>
  );
}
```

### Glass Effect Classes

Glassmorphic containers with frosted effect:

```tsx
// Standard glass effect
<div className="glass p-6 rounded-xl">
  Content with subtle blur
</div>

// Elevated with shadow
<div className="glass-elevated p-6 rounded-xl">
  Content with enhanced blur and shadow
</div>

// Glass with glow
<div className="glass-glow p-6 rounded-xl">
  Content with glow accent
</div>
```

### Glow Effects

Add ethereal glow to elements:

```tsx
// Primary blue glow
<div className="glow-primary">Glowing element</div>

// Secondary purple glow
<div className="glow-secondary">Glowing element</div>

// Accent glow
<div className="glow-accent">Glowing element</div>

// Small glow (subtle)
<div className="glow-sm">Slightly glowing element</div>

// Large glow (prominent)
<div className="glow-lg">Strongly glowing element</div>
```

### Animations

Modern animations for enhanced interactivity:

```tsx
// Pulsing glow
<div className="animate-glow-pulse">Pulsing glow effect</div>

// Floating motion
<div className="animate-float">Floating animation</div>

// Fade in
<div className="animate-fade-in">Fading in</div>
```

## Creating New Themes

### Step 1: Define the Theme

Edit `src/config/themes.ts`:

```typescript
export const lightModernTheme: ThemeColors = {
  background: "0 0% 100%", // white
  foreground: "222.2 84% 4.9%", // dark navy
  card: "0 0% 100%",
  // ... define all colors
};

export const themes: Record<ThemeName, ThemeColors> = {
  "dark-glassy": darkGlassyTheme,
  "light-modern": lightModernTheme, // Add new theme
};
```

### Step 2: Update Type

```typescript
export type ThemeName = "dark-glassy" | "light-modern";
```

### Step 3: Use Immediately

The theme will be selectable in the ThemeSwitcher:

```tsx
<select onChange={(e) => setCustomTheme(e.target.value)}>
  <option value="dark-glassy">Dark Glassy</option>
  <option value="light-modern">Light Modern</option>
</select>
```

## Tailwind Integration

All theme colors are available as Tailwind utilities:

```tsx
// Background colors
<div className="bg-background">...</div>
<div className="bg-primary">...</div>
<div className="bg-glass">...</div>

// Text colors
<div className="text-foreground">...</div>
<div className="text-primary">...</div>

// Border colors
<div className="border border-border">...</div>

// Shadow/glow
<div className="shadow-glow">...</div>
<div className="shadow-glow-lg">...</div>
```

## CSS Custom Properties

All colors are exposed as CSS variables for custom styling:

```css
/* Available in CSS */
background-color: hsl(var(--background));
color: hsl(var(--foreground));
box-shadow: 0 0 20px hsla(var(--glow-primary), 0.4);

/* Glass effect */
background: hsla(var(--glass) / 0.5);
backdrop-filter: blur(20px);
border: 1px solid hsla(var(--glass-light) / 0.3);
```

## Persistence

Theme preferences are saved to localStorage:

- **`display-theme`**: "light" | "dark" | "system"
- **`custom-theme`**: Theme name (e.g., "dark-glassy")

Preferences automatically restore on page reload.

## Best Practices

1. **Use semantic classes**: `text-primary` instead of hardcoding colors
2. **Leverage glass effects**: Create depth with glass containers
3. **Add glows sparingly**: Use for interactive elements and emphasis
4. **Test in both modes**: Ensure readability in light/dark
5. **Consider contrast**: WCAG AA minimum for accessibility

## Future Theme Ideas

- **Light Modern**: Clean, bright minimal design
- **Purple Haze**: Deep purple tones with cyan accents
- **Ocean**: Blue/teal palette with wave patterns
- **Forest**: Green/earth tones with organic shapes
- **Cyberpunk**: Neon colors with strong contrast

## Performance Considerations

- Glass effects use CSS `backdrop-filter` (GPU-accelerated)
- Glow effects use CSS `box-shadow` (optimized)
- Theme switching uses CSS variables (instant, no re-render)
- localStorage prevents flash of default theme

## Troubleshooting

### Theme not applying

- Clear browser cache and localStorage
- Verify `ThemeProvider` wraps your app in `src/app/providers.tsx`

### Glow not visible

- Ensure parent has overflow visible
- Check z-index if behind other elements
- Verify color contrast is sufficient

### Glass blur not working

- Browser must support `backdrop-filter`
- Check Firefox needs `-webkit-` prefix in some versions
- Safari requires specific property syntax

## Resources

- [Glassmorphism Design](https://uxdesign.cc/glassmorphism-in-user-interface-design-b55091a94319)
- [Tailwind CSS Custom Properties](https://tailwindcss.com/docs/customizing-colors)
- [CSS backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [HSL Color Model](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)
