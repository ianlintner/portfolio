import { useTheme } from "./ThemeProvider";
import { themes } from "../config/themes";

export function ThemeSwitcher() {
  const { customTheme, setCustomTheme } = useTheme();

  return (
    <select
      value={customTheme}
      onChange={(e) => setCustomTheme(e.target.value as keyof typeof themes)}
      title="Select color theme"
      className="px-3 py-1 rounded-lg bg-glass border border-glass-light text-foreground text-sm cursor-pointer hover:border-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary"
    >
      {Object.keys(themes).map((name) => (
        <option key={name} value={name}>
          {name
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}
        </option>
      ))}
    </select>
  );
}
