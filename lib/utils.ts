import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string | undefined | null, maxLength: number = 30): string {
  if (!text) return ""
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}
