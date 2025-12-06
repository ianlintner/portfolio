import { useTheme } from "./ThemeProvider";
import { themes } from "@/config/themes";

export function ThemeSwitcher() {
  const { customTheme, setCustomTheme, displayTheme, setDisplayTheme } =
    useTheme();

  return (
    <div className="flex gap-2">
      {/* Display Theme Toggle */}
      <div className="flex gap-1 rounded-lg bg-glass p-1">
        {(["light", "dark", "system"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setDisplayTheme(mode)}
            className={`px-3 py-1 rounded-md text-sm transition-all ${
              displayTheme === mode
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-foreground hover:bg-glass-light"
            }`}
            title={`Switch to ${mode} mode`}
            aria-label={`Display theme: ${mode}`}
          >
            {mode === "light" && "☀️"}
            {mode === "dark" && "🌙"}
            {mode === "system" && "🖥️"}
          </button>
        ))}
      </div>

      {/* Custom Theme Selector */}
      <select
        value={customTheme}
        onChange={(e) => setCustomTheme(e.target.value as keyof typeof themes)}
        title="Select color theme"
        className="px-3 py-1 rounded-lg bg-glass border border-glass-light text-foreground text-sm cursor-pointer hover:border-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option disabled>Select theme</option>
        {Object.keys(themes).map((name) => (
          <option key={name} value={name}>
            {name
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </option>
        ))}
      </select>
    </div>
  );
}
