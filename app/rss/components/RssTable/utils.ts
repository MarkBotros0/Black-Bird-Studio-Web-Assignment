import type { RssItem } from '../../types/rss';

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

