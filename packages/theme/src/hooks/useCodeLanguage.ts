"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  createElement,
} from "react";
import { getCookie, setCookie } from "./useCookieStorage";

const STORAGE_KEY = "preferred-code-language";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

/**
 * Available programming languages for code blocks
 */
export const CODE_LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "java",
  "csharp",
  "cpp",
  "c",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "scala",
  "shell",
  "bash",
  "powershell",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "graphql",
] as const;

export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

/**
 * Language display names for UI
 */
export const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  java: "Java",
  csharp: "C#",
  cpp: "C++",
  c: "C",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  shell: "Shell",
  bash: "Bash",
  powershell: "PowerShell",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  yaml: "YAML",
  markdown: "Markdown",
  graphql: "GraphQL",
};

/**
 * Language file extensions
 */
export const LANGUAGE_EXTENSIONS: Record<CodeLanguage, string> = {
  typescript: ".ts",
  javascript: ".js",
  python: ".py",
  rust: ".rs",
  go: ".go",
  java: ".java",
  csharp: ".cs",
  cpp: ".cpp",
  c: ".c",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  kotlin: ".kt",
  scala: ".scala",
  shell: ".sh",
  bash: ".sh",
  powershell: ".ps1",
  sql: ".sql",
  html: ".html",
  css: ".css",
  json: ".json",
  yaml: ".yml",
  markdown: ".md",
  graphql: ".graphql",
};

interface CodeLanguageContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: readonly string[];
  getLabel: (lang: string) => string;
  getExtension: (lang: string) => string;
}

const CodeLanguageContext = createContext<CodeLanguageContextValue | null>(
  null,
);

/**
 * CodeLanguageProvider
 *
 * Provides global code language preference state.
 * Wrap your app with this provider to enable language persistence across all CodeTabs.
 *
 * @example
 * <CodeLanguageProvider defaultLanguage="typescript">
 *   <App />
 * </CodeLanguageProvider>
 */
export function CodeLanguageProvider({
  children,
  defaultLanguage = "typescript",
}: {
  children: React.ReactNode;
  defaultLanguage?: string;
}) {
  const [language, setLanguageState] = useState<string>(defaultLanguage);

  // Initialize from storage on mount
  useEffect(() => {
    // Try cookie first (for SSR), then localStorage
    const cookieValue = getCookie(STORAGE_KEY);
    const localValue =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

    const savedLanguage = cookieValue || localValue;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);

    // Persist to both cookie (for SSR) and localStorage (for fallback)
    setCookie(STORAGE_KEY, lang, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);

      // Dispatch custom event for cross-component sync
      window.dispatchEvent(
        new CustomEvent("code-language-change", { detail: { language: lang } }),
      );
    }
  }, []);

  const getLabel = useCallback((lang: string): string => {
    return LANGUAGE_LABELS[lang as CodeLanguage] || lang;
  }, []);

  const getExtension = useCallback((lang: string): string => {
    return LANGUAGE_EXTENSIONS[lang as CodeLanguage] || "";
  }, []);

  return createElement(
    CodeLanguageContext.Provider,
    {
      value: {
        language,
        setLanguage,
        availableLanguages: CODE_LANGUAGES,
        getLabel,
        getExtension,
      },
    },
    children,
  );
}

/**
 * useCodeLanguage Hook
 *
 * Access and modify the global code language preference.
 * Must be used within a CodeLanguageProvider.
 *
 * @returns Object with language, setLanguage, and helper functions
 *
 * @example
 * const { language, setLanguage, getLabel } = useCodeLanguage();
 *
 * // Get display name
 * getLabel('typescript') // => "TypeScript"
 *
 * // Change language (persists and syncs across all components)
 * setLanguage('python')
 */
export function useCodeLanguage(): CodeLanguageContextValue {
  const context = useContext(CodeLanguageContext);

  if (!context) {
    throw new Error(
      "useCodeLanguage must be used within a CodeLanguageProvider",
    );
  }

  return context;
}

/**
 * Standalone hook for reading code language without provider
 * Useful for isolated components that don't need global state
 */
export function useCodeLanguageLocal(defaultLanguage = "typescript"): {
  language: string;
  setLanguage: (lang: string) => void;
} {
  const [language, setLanguageState] = useState(defaultLanguage);

  useEffect(() => {
    const cookieValue = getCookie(STORAGE_KEY);
    const localValue =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

    const saved = cookieValue || localValue;
    if (saved) {
      setLanguageState(saved);
    }

    // Listen for changes from other components
    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: string }>;
      setLanguageState(customEvent.detail.language);
    };

    window.addEventListener("code-language-change", handleChange);
    return () =>
      window.removeEventListener("code-language-change", handleChange);
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);

    setCookie(STORAGE_KEY, lang, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
      window.dispatchEvent(
        new CustomEvent("code-language-change", { detail: { language: lang } }),
      );
    }
  }, []);

  return { language, setLanguage };
}
