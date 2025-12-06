# @ianlintner/theme

Shared theme components and configuration for Portfolio apps.

## Installation

```bash
pnpm add @ianlintner/theme
```

## Usage

### 1. Configure Tailwind

Add the theme preset to your `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";
import themePreset from "@ianlintner/theme/tailwind.config";

const config: Config = {
  presets: [themePreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Add the theme package to content to ensure classes are generated
    "./node_modules/@ianlintner/theme/dist/**/*.{js,mjs}",
  ],
  // ...
};

export default config;
```

### 2. Import CSS

Import the global styles in your root layout or entry file (e.g., `src/app/globals.css` or `src/app/layout.tsx`):

```css
@import "@ianlintner/theme/styles.css";
```

Or in Next.js `layout.tsx`:

```tsx
import "@ianlintner/theme/styles.css";
```

### 3. Use ThemeProvider

Wrap your application with the `ThemeProvider`:

```tsx
import { ThemeProvider } from "@ianlintner/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 4. Use Components

```tsx
import { ThemeSwitcher } from "@ianlintner/theme";

export function Header() {
  return (
    <header>
      <ThemeSwitcher />
    </header>
  );
}
```
