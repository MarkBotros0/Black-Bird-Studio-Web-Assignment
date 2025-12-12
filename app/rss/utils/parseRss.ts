import type { RssFeed, RssError } from '../types/rss';
import { parseRssXmlCommon } from './parseRssCommon';

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 * 
 * @param urlString - String to validate as URL
 * @returns True if the string is a valid HTTP or HTTPS URL
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }

  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Parses RSS XML string into structured JSON data (supports RSS 2.0 and Atom)
 * Client-side parser using browser DOMParser
 */
export function parseRssXml(xmlString: string): { feed: RssFeed; error?: RssError } {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return parseRssXmlCommon(xmlDoc);
  } catch (error) {
    return {
      feed: { channelFields: {}, items: [], feedType: 'rss' },
      error: {
        message: error instanceof Error ? error.message : 'Failed to parse RSS XML',
        type: 'PARSE_ERROR',
      },
    };
  }
}
