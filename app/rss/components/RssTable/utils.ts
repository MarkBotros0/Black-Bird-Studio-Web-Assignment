import type { RssItem } from '../../types/rss';

/**
 * Gets all unique field names from all items
 * Filters out empty/undefined values
 *
 * @param items - Array of RSS items
 * @returns Sorted array of unique field names
 */
export function getAllFields(items: RssItem[]): string[] {
  if (!items?.length) {
    return [];
  }

  const fieldSet = new Set<string>();
  
  for (const item of items) {
    if (!item) continue;
    
    for (const [key, value] of Object.entries(item)) {
      if (value?.trim()) {
        fieldSet.add(key);
      }
    }
  }
  
  return Array.from(fieldSet).sort();
}

