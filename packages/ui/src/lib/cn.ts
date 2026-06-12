import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine class names with Tailwind-aware deduplication.
 * The single shared helper used by every component in @ppid/ui.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
