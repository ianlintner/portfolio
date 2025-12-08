/**
 * Class Name Utility
 *
 * Combines clsx for conditional classes with tailwind-merge
 * for intelligent Tailwind CSS class merging.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary', className)
 * cn('text-red-500', 'text-blue-500') // => 'text-blue-500' (last wins)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
