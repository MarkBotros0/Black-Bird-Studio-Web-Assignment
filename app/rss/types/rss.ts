/**
 * RSS item with dynamic fields - stores all XML elements as key-value pairs
 * @public
 */
export type RssItem = Record<string, string | undefined>;

/**
 * RSS feed metadata with dynamic channel fields
 * @public
 */
export interface RssFeed {
  /** Channel-level metadata fields (title, description, link, etc.) */
  channelFields: Record<string, string>;
  /** Array of RSS items/entries */
  items: RssItem[];
  /** Feed format type */
  feedType: 'rss' | 'atom';
}

/**
 * Parsed RSS data containing feed and raw XML
 * @public
 */
export interface ParsedRssData {
  /** Parsed feed structure */
  feed: RssFeed;
  /** Original raw XML string */
  rawXml: string;
}

/**
 * RSS error types
 * @public
 */
export type RssErrorType =
  | 'INVALID_URL'
  | 'FETCH_ERROR'
  | 'PARSE_ERROR'
  | 'VALIDATION_ERROR';

/**
 * RSS error object
 * @public
 */
export interface RssError {
  /** Human-readable error message */
  message: string;
  /** Error type category */
  type: RssErrorType;
}

