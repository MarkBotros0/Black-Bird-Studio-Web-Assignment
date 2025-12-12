import { DOMParser } from '@xmldom/xmldom';
import type { RssFeed, RssError } from '../types/rss';
import { parseRssXmlCommon } from './parseRssCommon';

/**
 * Server-side RSS XML parser (uses @xmldom/xmldom instead of browser DOMParser)
 * Parses RSS 2.0 or Atom feeds into structured data
 *
 * @param xmlString - Raw XML string from RSS/Atom feed
 * @returns Object containing parsed feed data and optional error
 */
export function parseRssXmlServer(xmlString: string): { feed: RssFeed; error?: RssError } {
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

