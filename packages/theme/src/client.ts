"use client";

// Client-only entrypoint.
//
// Next.js React Server Components cannot evaluate React class components
// (including Error Boundaries) inside Server Component module graphs.
// Import these from "@ianlintner/theme/client".

export { ErrorBoundary, type ErrorBoundaryProps } from "./components/patterns/ErrorBoundary";
