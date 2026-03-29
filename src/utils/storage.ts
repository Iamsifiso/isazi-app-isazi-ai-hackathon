/**
 * Safe localStorage utilities with validation
 * Prevents app crashes from corrupted or invalid localStorage data
 */

/**
 * Safely gets an item from localStorage with JSON parsing
 * Returns null if item doesn't exist or is corrupted
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage item "${key}":`, error);
    // Clear corrupted data
    localStorage.removeItem(key);
    return defaultValue;
  }
}

/**
 * Safely sets an item in localStorage with JSON stringification
 * Returns true if successful, false otherwise
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save localStorage item "${key}":`, error);
    return false;
  }
}

/**
 * Safely removes an item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage item "${key}":`, error);
  }
}

/**
 * Validates and sanitizes a phone number
 * Returns cleaned number or empty string if invalid
 */
export function validatePhoneNumber(input: string): string {
  // Remove all non-digit characters
  const cleaned = input.replace(/\D/g, '');

  // Check if it's a valid length (typically 10-15 digits)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return '';
  }

  return cleaned;
}

/**
 * Validates an array of phrases
 * Returns valid phrases only, filters out corrupted ones
 */
export function validatePhrases(phrases: any[]): any[] {
  if (!Array.isArray(phrases)) {
    return [];
  }

  return phrases.filter(phrase => {
    return (
      phrase &&
      typeof phrase === 'object' &&
      typeof phrase.id === 'string' &&
      typeof phrase.text === 'string' &&
      typeof phrase.category === 'string' &&
      phrase.id.length > 0 &&
      phrase.text.length > 0
    );
  });
}

/**
 * Validates an array of custom categories
 * Returns valid category names only
 */
export function validateCategories(categories: any[]): string[] {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories.filter(cat => typeof cat === 'string' && cat.length > 0);
}

/**
 * Validates recent phrases array
 * Returns valid recent phrases only, limited to maxCount
 */
export function validateRecentPhrases(phrases: any[], maxCount: number = 20): any[] {
  if (!Array.isArray(phrases)) {
    return [];
  }

  const validated = phrases.filter(phrase => {
    return (
      phrase &&
      typeof phrase === 'object' &&
      typeof phrase.text === 'string' &&
      typeof phrase.timestamp === 'number' &&
      phrase.text.length > 0
    );
  });

  // Limit to maxCount most recent
  return validated.slice(0, maxCount);
}
