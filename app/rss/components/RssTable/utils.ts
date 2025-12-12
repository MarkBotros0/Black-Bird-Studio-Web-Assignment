import type { RssItem } from '../../types/rss';
import { hasAttributes as checkHasAttributes } from '../../utils/fieldParsing';

/**
 * Gets all unique field names from all items
 * Filters out empty/undefined values
 *
 * @param items - Array of RSS items
 * @returns Sorted array of unique field names
 */
export function getAllFields(items: RssItem[]): string[] {
  if (!items || items.length === 0) {
    return [];
  }

  const fieldSet = new Set<string>();
  
  for (const item of items) {
    if (!item) continue;
    
    for (const key of Object.keys(item)) {
      if (item[key] && typeof item[key] === 'string' && item[key].trim()) {
        fieldSet.add(key);
      }
    }
  }
  
  return Array.from(fieldSet).sort();
}

/**
 * Checks if a field value contains JSON with attributes
 * Re-exports the utility function for convenience
 *
 * @param value - Field value to check
 * @returns True if value is JSON with attributes object
 */
export function hasAttributes(value: string | undefined): boolean {
  return checkHasAttributes(value);
}

