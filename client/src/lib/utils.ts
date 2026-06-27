import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with clsx and resolves Tailwind class conflicts via
 * tailwind-merge.
 *
 * @param inputs - Class values (strings, arrays, conditionals).
 * @returns The merged, de-conflicted className string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
