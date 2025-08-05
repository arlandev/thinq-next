import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique reference number for tickets
 * Format: YYYYMMDD-XXXXX (e.g., 20241201-00001)
 * @returns A unique reference number string
 */
export function generateReferenceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const datePrefix = `${year}${month}${day}`
  
  // Generate a random 5-digit number
  const randomSuffix = String(Math.floor(Math.random() * 100000)).padStart(5, '0')
  
  return `${datePrefix}-${randomSuffix}`
}

/**
 * Generates a unique reference number with a counter-based approach
 * This ensures uniqueness by checking existing reference numbers
 * @param existingReferenceNumbers - Array of existing reference numbers to avoid duplicates
 * @returns A unique reference number string
 */
export function generateUniqueReferenceNumber(existingReferenceNumbers: string[] = []): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const datePrefix = `${year}${month}${day}`
  
  // Filter out null/undefined values and find the highest counter for today's date
  const validReferences = existingReferenceNumbers.filter(ref => ref && typeof ref === 'string')
  const todayReferences = validReferences.filter(ref => ref.startsWith(datePrefix))
  const counters = todayReferences.map(ref => {
    const counterPart = ref.split('-')[1]
    return parseInt(counterPart || '0', 10)
  })
  
  const nextCounter = counters.length > 0 ? Math.max(...counters) + 1 : 1
  const counterSuffix = String(nextCounter).padStart(5, '0')
  
  return `${datePrefix}-${counterSuffix}`
}
