import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glass: {
          DEFAULT: "hsl(var(--glass))",
          light: "hsl(var(--glass-light))",
          dark: "hsl(var(--glass-dark))",
        },
        glow: {
          primary: "hsl(var(--glow-primary))",
          secondary: "hsl(var(--glow-secondary))",
          accent: "hsl(var(--glow-accent))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
        "blur-xl": "blur(30px)",
      },
      boxShadow: {
        glow: "0 0 20px hsla(var(--glow-primary), 0.4)",
        "glow-sm": "0 0 15px hsla(var(--glow-primary), 0.2)",
        "glow-lg":
          "0 0 40px hsla(var(--glow-primary), 0.3), 0 0 60px hsla(var(--glow-secondary), 0.15)",
        "glow-secondary": "0 0 30px hsla(var(--glow-secondary), 0.4)",
        "glow-accent": "0 0 30px hsla(var(--glow-accent), 0.4)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "hsl(var(--foreground))",
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "underline",
              fontWeight: "500",
              transition: "all 0.3s ease",
              "&:hover": {
                textDecorationThickness: "2px",
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: "transparent",
              border: "1px solid hsl(var(--border))",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: ["class"],
};

export default config;
