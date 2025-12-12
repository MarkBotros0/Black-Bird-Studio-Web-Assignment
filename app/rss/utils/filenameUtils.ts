import { MAX_FILENAME_LENGTH } from '../constants';

/**
 * Sanitizes a string to be used as a filename
 * Removes invalid characters and limits length
 *
 * @param filename - Original filename string
 * @returns Sanitized filename safe for filesystem
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'feed';
  }

  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
    .substring(0, MAX_FILENAME_LENGTH) || 'feed';
}

/**
 * Generates a safe XML filename from a feed title
 *
 * @param feedTitle - Feed title or name
 * @param fallback - Fallback name if title is empty (default: 'feed')
 * @returns Safe filename with .xml extension
 */
export function generateXmlFilename(feedTitle: string | undefined, fallback = 'feed'): string {
  const title = feedTitle || fallback;
  const sanitized = sanitizeFilename(title);
  return `${sanitized}.xml`;
}

