"use client";

import { useState, useEffect, useCallback } from "react";

export interface CookieOptions {
  /** Max age in seconds (default: 1 year) */
  maxAge?: number;
  /** Expiration date */
  expires?: Date;
  /** Cookie path (default: '/') */
  path?: string;
  /** Cookie domain */
  domain?: string;
  /** Secure flag (default: true in production) */
  secure?: boolean;
  /** SameSite attribute (default: 'lax') */
  sameSite?: "strict" | "lax" | "none";
}

const DEFAULT_OPTIONS: CookieOptions = {
  maxAge: 365 * 24 * 60 * 60, // 1 year
  path: "/",
  sameSite: "lax",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

/**
 * Parse a cookie value from the document.cookie string
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      try {
        return decodeURIComponent(cookieValue || "");
      } catch {
        return cookieValue || null;
      }
    }
  }
  return null;
}

/**
 * Set a cookie with the given name, value, and options
 */
function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") return;

  const opts = { ...DEFAULT_OPTIONS, ...options };
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.maxAge !== undefined) {
    cookieString += `; max-age=${opts.maxAge}`;
  }

  if (opts.expires) {
    cookieString += `; expires=${opts.expires.toUTCString()}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }

  if (opts.secure) {
    cookieString += "; secure";
  }

  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Delete a cookie by setting its max-age to 0
 */
function deleteCookie(name: string, options: CookieOptions = {}): void {
  setCookie(name, "", { ...options, maxAge: 0 });
}

/**
 * useCookieStorage Hook
 *
 * Provides persistent state storage using cookies with SSR safety.
 * Useful for preferences that need to be read server-side.
 *
 * @param key - The cookie name
 * @param initialValue - Default value if cookie doesn't exist
 * @param options - Cookie options (maxAge, path, domain, secure, sameSite)
 * @returns Tuple of [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme] = useCookieStorage('preferred-theme', 'dark');
 */
export function useCookieStorage<T>(
  key: string,
  initialValue: T,
  options: CookieOptions = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize from cookie on mount
  useEffect(() => {
    const cookieValue = getCookie(key);
    if (cookieValue !== null) {
      try {
        setStoredValue(JSON.parse(cookieValue) as T);
      } catch {
        // If not valid JSON, use as string
        setStoredValue(cookieValue as unknown as T);
      }
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      setCookie(key, JSON.stringify(valueToStore), options);
    },
    [key, options, storedValue]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    deleteCookie(key, options);
  }, [key, initialValue, options]);

  return [storedValue, setValue, removeValue];
}

// Export utility functions for direct use
export { getCookie, setCookie, deleteCookie };
