# Theme System Integration Guide

## What You Got

A complete, production-ready theme system with:
- ✅ Modern dark glassy design
- ✅ Interchangeable themes
- ✅ Theme persistence
- ✅ Full TypeScript support
- ✅ Extensive documentation
- ✅ Demo components
- ✅ Utility hooks

## 5-Minute Integration

### Step 1: Add ThemeSwitcher to Navigation

Edit `src/components/Navigation.tsx`:

```tsx
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navigation() {
  return (
    <nav className="glass p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-foreground">Portfolio</h1>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
```

### Step 2: View the Showcase

Create a demo page:

```tsx
// src/app/theme-demo/page.tsx
import { ThemeShowcase } from "@/components/ThemeShowcase";

export default function ThemeDemoPage() {
  return <ThemeShowcase />;
}
```

Navigate to `/theme-demo` to see all features!

### Step 3: Update Your Components

Start using the new classes:

```tsx
// Before
<div className="bg-white border border-gray-200 rounded-lg">
  <h2>Card Title</h2>
</div>

// After
<div className="glass p-6 rounded-xl glow-primary">
  <h2 className="text-foreground">Card Title</h2>
</div>
```

### Step 4: Done!

The theme system is now active. Users can:
- Toggle light/dark mode
- Select different theme designs
- Preferences save to localStorage

## Usage Examples

### Use Theme Context
```tsx
"use client";
import { useTheme } from "@/components/ThemeProvider";

export function MyComponent() {
  const { displayTheme, customTheme } = useTheme();
  
  return (
    <div>
      Display: {displayTheme} | Design: {customTheme}
    </div>
  );
}
```

### Use Theme Utilities
```tsx
"use client";
import { useThemeClass, glassVariants, useIsDarkMode } from "@/utils/theme";

export function SmartCard() {
  const isDark = useIsDarkMode();
  
  return (
    <div className={`${glassVariants.elevated} p-6`}>
      {isDark ? "Dark mode active" : "Light mode active"}
    </div>
  );
}
```

### Use Glass Effects
```tsx
// All available glass classes
<div className="glass">Standard glass</div>
<div className="glass-elevated">Elevated with shadow</div>
<div className="glass-glow">Glass with glow</div>
```

### Use Glow Effects
```tsx
// All available glow classes
<div className="glow-primary">Primary blue glow</div>
<div className="glow-secondary">Purple glow</div>
<div className="glow-accent">Cyan glow</div>
<div className="glow-sm">Subtle glow</div>
<div className="glow-lg">Strong glow</div>
```

### Use Animations
```tsx
<div className="animate-glow-pulse">Pulsing glow</div>
<div className="animate-float">Floating motion</div>
<div className="animate-fade-in">Fade in</div>
<div className="animate-in">Slide in</div>
```

## Quick Reference

### Files to Explore

1. **`docs/THEME_QUICK_START.md`** - 5-min read
2. **`docs/THEME_VISUAL_GUIDE.md`** - Design reference
3. **`docs/THEME_SYSTEM.md`** - Complete docs
4. **`src/components/ThemeShowcase.tsx`** - Live examples

### Key Components

- `ThemeProvider` - Wrap your app (already done in providers.tsx)
- `ThemeSwitcher` - Add to Navigation
- `ThemeShowcase` - View all features

### Key Utilities

- `useTheme()` - Access theme state
- `useThemeClass()` - Conditional classes
- `useIsDarkMode()` - Check dark mode
- `getCSSVar()` - Get CSS variable value

## Common Tasks

### Add ThemeSwitcher to Footer
```tsx
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Footer() {
  return (
    <footer className="glass-elevated p-6 mt-12">
      <div className="flex justify-between">
        <p>© 2025 Ian Lintner</p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
```

### Style a Button with Glow
```tsx
<button className="px-4 py-2 bg-primary text-primary-foreground 
                   rounded-lg hover:glow-primary transition-all">
  Click me
</button>
```

### Create a Glass Modal
```tsx
<div className="glass-elevated p-8 rounded-xl max-w-md mx-auto">
  <h2 className="text-2xl font-bold text-foreground mb-4">
    Modal Title
  </h2>
  <p className="text-muted-foreground">
    Modal content goes here
  </p>
</div>
```

### Create a Floating Card
```tsx
<div className="glass p-6 rounded-xl animate-float 
                animate-glow-pulse max-w-sm">
  <p className="text-foreground font-semibold">
    Floating & Glowing Card
  </p>
</div>
```

## Adding a New Theme

### 1. Define Colors in `src/config/themes.ts`

```typescript
export const myNewTheme: ThemeColors = {
  background: "210 40% 4%",
  foreground: "210 40% 98%",
  primary: "217 100% 60%",
  secondary: "215 32% 20%",
  accent: "270 100% 60%",
  card: "210 40% 8%",
  popover: "210 40% 10%",
  muted: "215 32% 18%",
  mutedForeground: "210 40% 70%",
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "210 40% 98%",
  border: "215 32% 18%",
  input: "215 32% 16%",
  ring: "217 100% 60%",
  glass: "210 40% 15%",
  glassLight: "210 40% 20%",
  glassDark: "210 40% 8%",
  glowPrimary: "217 100% 60%",
  glowSecondary: "270 100% 60%",
  glowAccent: "190 100% 50%",
};
```

### 2. Update Type

```typescript
export type ThemeName = "dark-glassy" | "my-new-theme";

export const themes: Record<ThemeName, ThemeColors> = {
  "dark-glassy": darkGlassyTheme,
  "my-new-theme": myNewTheme,
};
```

### 3. Done!

The new theme is immediately available in ThemeSwitcher.

## Styling Patterns

### Pattern: Glass Container
```tsx
<div className="glass p-6 rounded-xl">
  {children}
</div>
```

### Pattern: Glowing Interactive Element
```tsx
<button className="bg-primary text-primary-foreground 
                   rounded-lg p-4 hover:glow-primary transition-all">
  Interactive
</button>
```

### Pattern: Floating Emphasis
```tsx
<div className="glass-glow p-6 animate-float animate-glow-pulse">
  {emphasis}
</div>
```

### Pattern: Glass Layout
```tsx
<div className="min-h-screen bg-gradient-to-br 
                from-background to-background/80">
  <div className="glass-elevated p-8 rounded-xl max-w-4xl mx-auto">
    {content}
  </div>
</div>
```

## Testing Your Theme

### Manual Testing Checklist

- [ ] ThemeSwitcher appears in Navigation/Footer
- [ ] Light mode toggle works
- [ ] Dark mode toggle works
- [ ] System mode respects OS preference
- [ ] Theme persists on page reload
- [ ] Glass effects visible
- [ ] Glow effects visible
- [ ] Animations smooth
- [ ] Text readable (contrast)
- [ ] All colors distinct

### Automated Testing (Optional)

```tsx
describe("Theme System", () => {
  it("switches themes", () => {
    // Test theme switching
  });

  it("persists preference", () => {
    // Test localStorage
  });

  it("applies CSS variables", () => {
    // Test CSS variable application
  });
});
```

## Performance Tips

1. **Use semantic classes** - `text-primary` not `text-[#00b4ff]`
2. **Leverage glass sparingly** - Too much looks messy
3. **Add glows to interactive elements** - Creates affordance
4. **Test accessibility** - Ensure color contrast
5. **Check animations** - Respect `prefers-reduced-motion`

## Troubleshooting

### Theme won't switch
```bash
# Clear browser cache and localStorage
# Check ThemeProvider wraps app in providers.tsx
# Verify ThemeSwitcher is mounted (use client)
```

### Glow not visible
```tsx
// Check:
// 1. Parent overflow: visible (not overflow: hidden)
// 2. Z-index not behind other elements
// 3. Color contrast sufficient
// 4. Not inside another glow effect
```

### Glass blur not working
```tsx
// Check:
// 1. Browser supports backdrop-filter (99%+ do)
// 2. Element background color set
// 3. Not on white background (use on dark)
```

## Next Steps

1. ✅ Add ThemeSwitcher to Navigation
2. ✅ View ThemeShowcase at `/theme-demo`
3. ✅ Update components with new classes
4. ✅ Test in light/dark modes
5. ✅ Create additional themes (optional)

## Resources

- **Quick Start**: `docs/THEME_QUICK_START.md`
- **Full Docs**: `docs/THEME_SYSTEM.md`
- **Visual Guide**: `docs/THEME_VISUAL_GUIDE.md`
- **File Structure**: `docs/THEME_FILE_STRUCTURE.md`
- **Demo**: Visit `/theme-demo` page

---

**Everything is ready to use!** Start with Step 1 above. 🚀
