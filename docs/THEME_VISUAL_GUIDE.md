# Theme System - Visual Guide

## 🎨 Dark Glassy Theme Preview

### Color Palette

| Color | Value | Usage |
|-------|-------|-------|
| **Primary** | `#00b4ff` | Primary actions, buttons, links |
| **Secondary** | `#334155` | Secondary UI elements |
| **Accent** | `#b300ff` | Special highlights, emphasis |
| **Background** | `#0a0e27` | Page background |
| **Foreground** | `#F8FAFC` | Text content |
| **Destructive** | `#ef4444` | Delete, danger actions |
| **Muted** | `#475569` | Disabled states, secondary text |

### Glass Effects

**Standard Glass**
```
- Backdrop blur: 20px
- Opacity: 50%
- Border: 30% lighter glass color
- Use for: Card containers, modals
```

**Elevated Glass**
```
- Backdrop blur: 30px
- Opacity: 60%
- Shadow: Subtle glow
- Use for: Prominent cards, dropdowns
```

**Glowing Glass**
```
- Backdrop blur: 20px
- Opacity: 50%
- Border: Primary color with opacity
- Glow: Primary blue aura
- Use for: Interactive sections, highlights
```

### Glow Effects

**Primary Glow** (Electric Blue)
```
Box-shadow: 0 0 20px hsla(217, 100%, 60%, 0.4)
Pulses with animate-glow-pulse
```

**Secondary Glow** (Purple)
```
Box-shadow: 0 0 30px hsla(270, 100%, 60%, 0.4)
For accent elements
```

**Accent Glow** (Cyan)
```
Box-shadow: 0 0 30px hsla(190, 100%, 50%, 0.4)
Subtle alternate accent
```

### Animations

**Glow Pulse**
```css
0%   → box-shadow opacity 0.3
50%  → box-shadow opacity 0.6 (2x larger)
100% → box-shadow opacity 0.3
Duration: 3s infinite
```

**Float**
```css
0%   → translateY(0px)
50%  → translateY(-5px)
100% → translateY(0px)
Duration: 6s infinite ease-in-out
```

**Fade In**
```css
0%   → opacity 0, translateY(10px)
100% → opacity 1, translateY(0)
Duration: 0.6s ease-out
```

## 📱 Component Examples

### Themed Card
```tsx
<div className="glass p-6 rounded-xl">
  <h3 className="text-lg font-semibold text-foreground">
    Glassy Card
  </h3>
  <p className="text-muted-foreground mt-2">
    With frosted glass effect
  </p>
</div>
```

### Glowing Button
```tsx
<button className="px-6 py-2 bg-primary text-primary-foreground 
                   rounded-lg hover:glow-primary transition-all">
  Glowing Button
</button>
```

### Glass Container with Glow
```tsx
<div className="glass-glow p-8 rounded-xl">
  <p className="text-foreground">
    This container has glass effect + primary glow
  </p>
</div>
```

### Floating Element with Pulse
```tsx
<div className="bg-accent rounded-lg p-4 
                animate-float animate-glow-pulse">
  Floating & Pulsing
</div>
```

## 🎯 Usage Patterns

### Pattern 1: Simple Theme Switch
```tsx
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Navigation() {
  return (
    <header className="glass p-4">
      <ThemeSwitcher />
    </header>
  );
}
```

### Pattern 2: Theme-Aware Component
```tsx
"use client";

import { useTheme } from "@/components/ThemeProvider";

export function MyCard() {
  const { customTheme } = useTheme();
  
  return (
    <div className={`
      glass-elevated p-6 rounded-xl
      ${customTheme === 'dark-glassy' ? 'glow-primary' : ''}
    `}>
      Content
    </div>
  );
}
```

### Pattern 3: Glass Layout
```tsx
export function PageLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br 
                    from-background to-background/80">
      <div className="glass-elevated p-8 rounded-2xl max-w-4xl mx-auto">
        <h1 className="text-4xl text-foreground">Page Title</h1>
      </div>
    </div>
  );
}
```

## 🚀 Integration Checklist

- [ ] Import ThemeSwitcher into Navigation component
- [ ] Update existing card components to use `.glass` class
- [ ] Add glow effects to interactive elements
- [ ] Use glass effects for modals/dropdowns
- [ ] Test light/dark mode switching
- [ ] Verify scrollbar styling
- [ ] Check code block colors
- [ ] Test on different browsers
- [ ] Plan additional themes
- [ ] Update component library

## 📚 CSS Classes Cheat Sheet

### Glass Effects
```
.glass              /* Standard frosted glass */
.glass-elevated     /* Elevated with shadow */
.glass-glow         /* With primary glow */
```

### Glow Effects
```
.glow-primary       /* Electric blue glow */
.glow-secondary     /* Purple glow */
.glow-accent        /* Cyan glow */
.glow-sm            /* Subtle glow */
.glow-lg            /* Strong double glow */
```

### Animations
```
.animate-glow-pulse /* Pulsing glow */
.animate-float      /* Floating motion */
.animate-fade-in    /* Fade in entrance */
.animate-in         /* Slide in from top */
```

### Colors
```
.bg-primary         /* Electric blue */
.bg-secondary       /* Slate */
.bg-accent          /* Purple */
.bg-glass           /* Semi-transparent navy */
.text-foreground    /* Near white */
.text-muted         /* Muted text */
```

## 🎨 Tailwind Extensions

### New Color Groups
```tsx
<div className="bg-glass">                    {/* Transparent navy */}
<div className="bg-glass-light">              {/* Lighter transparent */}
<div className="text-glow-primary">           {/* Glowing text */}
```

### Box Shadows
```tsx
<div className="shadow-glow">                 {/* Standard glow */}
<div className="shadow-glow-sm">              {/* Small glow */}
<div className="shadow-glow-lg">              {/* Large dual glow */}
```

## 🔮 Future Theme Ideas

### Light Modern
- Bright white background
- Deep slate text
- Soft glass effects
- Pastel accents

### Purple Haze
- Deep purple background
- Neon cyan accents
- Gradient overlays
- Cyberpunk vibes

### Ocean
- Deep blue background
- Turquoise accents
- Wave patterns
- Serene aesthetic

### Forest
- Dark green background
- Earth tone accents
- Organic shapes
- Natural feel

---

**Fully implemented and ready to use!**
See THEME_SYSTEM.md for complete documentation.
