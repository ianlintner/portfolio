/**
 * Hooks Index
 *
 * Export all utility hooks for the theme package.
 */

export { useLocalStorage, isLocalStorageAvailable } from "./useLocalStorage";

export {
  useCookieStorage,
  getCookie,
  setCookie,
  deleteCookie,
  type CookieOptions,
} from "./useCookieStorage";

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  useBreakpoint,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  usePrefersHighContrast,
} from "./useMediaQuery";

export {
  useCodeLanguage,
  useCodeLanguageLocal,
  CodeLanguageProvider,
  CODE_LANGUAGES,
  LANGUAGE_LABELS,
  LANGUAGE_EXTENSIONS,
  type CodeLanguage,
} from "./useCodeLanguage";
