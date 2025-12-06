"use client";

import { ThemeSwitcher } from "./ThemeSwitcher";

/**
 * ThemeShowcase Component
 *
 * Demonstrates all available theme utilities and glass/glow effects
 */
export function ThemeShowcase() {
  return (
    <div className="space-y-8 py-12 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-glow-accent bg-clip-text text-transparent">
          Theme Showcase
        </h1>
        <p className="text-muted-foreground">
          Modern dark, glassy theme system with 2025 design aesthetics
        </p>
      </div>

      {/* Theme Switcher */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Theme Controls</h2>
        <ThemeSwitcher />
      </div>

      {/* Glass Effect Cards */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Glass Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Standard Glass</p>
            <p className="text-foreground">
              Subtle frosted effect with backdrop blur
            </p>
          </div>
          <div className="glass-elevated p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Elevated Glass</p>
            <p className="text-foreground">Enhanced blur with subtle shadow</p>
          </div>
          <div className="glass-glow p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Glowing Glass</p>
            <p className="text-foreground">Primary color glow accent</p>
          </div>
        </div>
      </div>

      {/* Glow Effects */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Glow Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-32 rounded-xl bg-gradient-to-br from-primary to-primary/50 glow-primary flex items-center justify-center">
            <span className="text-center text-xs font-semibold">
              Primary Glow
            </span>
          </div>
          <div className="h-32 rounded-xl bg-gradient-to-br from-accent to-accent/50 glow-secondary flex items-center justify-center">
            <span className="text-center text-xs font-semibold">
              Secondary Glow
            </span>
          </div>
          <div className="h-32 rounded-xl bg-gradient-to-br from-glow-accent to-glow-accent/50 glow-accent flex items-center justify-center">
            <span className="text-center text-xs font-semibold">
              Accent Glow
            </span>
          </div>
          <div className="h-32 rounded-xl bg-glass-light glow-sm flex items-center justify-center">
            <span className="text-center text-xs font-semibold">
              Small Glow
            </span>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Primary", class: "bg-primary" },
            { name: "Secondary", class: "bg-secondary" },
            { name: "Accent", class: "bg-accent" },
            { name: "Destructive", class: "bg-destructive" },
            { name: "Muted", class: "bg-muted" },
            { name: "Card", class: "bg-card" },
            { name: "Glass", class: "bg-glass" },
            { name: "Glass Light", class: "bg-glass-light" },
          ].map((color) => (
            <div key={color.name} className="space-y-2">
              <div
                className={`h-16 rounded-lg ${color.class} border border-border`}
              />
              <p className="text-xs text-muted-foreground text-center">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-6 rounded-xl">
            <div className="h-16 bg-primary rounded-lg animate-glow-pulse mx-auto" />
            <p className="text-center text-xs text-muted-foreground mt-4">
              Glow Pulse
            </p>
          </div>
          <div className="glass p-6 rounded-xl">
            <div className="h-16 w-16 bg-accent rounded-lg animate-float mx-auto" />
            <p className="text-center text-xs text-muted-foreground mt-4">
              Float
            </p>
          </div>
          <div className="glass p-6 rounded-xl">
            <div className="h-16 bg-gradient-to-r from-primary to-accent rounded-lg animate-fade-in mx-auto" />
            <p className="text-center text-xs text-muted-foreground mt-4">
              Fade In
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Interactive Elements</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:glow-primary transition-all">
            Primary Button
          </button>
          <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-all">
            Secondary Button
          </button>
          <button className="px-6 py-2 glass text-foreground rounded-lg hover:glass-elevated transition-all">
            Glass Button
          </button>
          <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:glow-secondary transition-all">
            Accent Button
          </button>
        </div>
      </div>

      {/* Code Block Example */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Code Styling</h2>
        <pre className="prose prose-invert max-w-none">
          <code>{`// Dark Glassy Theme - Modern 2025 Design
const theme = {
  background: "deep navy",
  glass: "frosted effect",
  glow: "electric blue",
  minimal: "clean aesthetic"
};`}</code>
        </pre>
      </div>
    </div>
  );
}
