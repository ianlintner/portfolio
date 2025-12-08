# Theme Package Guide

This directory contains the extracted theme components and configuration, ready to be shared across applications.

## Structure

- `src/config/themes.ts`: Theme definitions (colors, etc.)
- `src/components/`: React components (ThemeProvider, ThemeSwitcher)
- `src/utils/`: Utility functions
- `src/styles/globals.css`: Global CSS variables and utilities
- `tailwind.config.ts`: Tailwind preset

## Publishing

To publish this package to npm (or a private registry):

1.  **Login to npm:**

    ```bash
    npm login
    ```

2.  **Publish:**
    ```bash
    npm publish --access public
    ```
    (Remove `--access public` if publishing to a private registry or if it's not a scoped package).

## Local Development (Linking)

To test this package in another local app without publishing:

1.  **In this directory:**

    ```bash
    pnpm link --global
    ```

2.  **In your consumer app:**
    ```bash
    pnpm link --global @portfolio/theme
    ```

## Integration

See `README.md` for detailed integration instructions.
