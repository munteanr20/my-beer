/**
 * Get the current year as a number
 * @returns {number} The current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Get the current year as a string
 * @returns {string} The current year as a string
 */
export function getCurrentYearString(): string {
  return new Date().getFullYear().toString();
} 