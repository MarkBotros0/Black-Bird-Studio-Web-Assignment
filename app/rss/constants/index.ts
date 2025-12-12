/**
 * Constants for RSS feed application
 */

/** Minimum column width in pixels */
export const MIN_COLUMN_WIDTH = 100;

/** Default column widths based on field types */
export const DEFAULT_COLUMN_WIDTHS = {
  TITLE: 250,
  DESCRIPTION: 350,
  DATE: 180,
  LINK: 300,
  IMAGE: 140,
  AUTHOR: 180,
  CATEGORY: 150,
  DEFAULT: 200,
} as const;

/** API route for RSS fetching */
export const RSS_API_ROUTE = '/api/rss';

/** User agent for RSS feed requests */
export const RSS_USER_AGENT = 'Mozilla/5.0 (compatible; RSS Reader)';

/** Accept headers for RSS feed requests */
export const RSS_ACCEPT_HEADERS = 'application/rss+xml, application/xml, text/xml, */*';

/** Maximum description preview length */
export const MAX_DESCRIPTION_PREVIEW = 200;

/** Number of lines to clamp for long text fields */
export const LONG_TEXT_LINE_CLAMP = 3;

/** Character threshold for making fields expandable/collapsible */
export const EXPANDABLE_FIELD_THRESHOLD = 500;

/** Request timeout in milliseconds */
export const REQUEST_TIMEOUT_MS = 30000;

/** Maximum filename length for downloaded XML files */
export const MAX_FILENAME_LENGTH = 100;

/** XML namespaces */
export const XML_NAMESPACES = {
  ATOM: 'http://www.w3.org/2005/Atom',
} as const;

/** RSS/Atom XML tag names */
export const XML_TAGS = {
  RSS: 'rss',
  CHANNEL: 'channel',
  ITEM: 'item',
  FEED: 'feed',
  ENTRY: 'entry',
  PARSER_ERROR: 'parsererror',
} as const;

/** UI styling constants */
export const UI_CLASSES = {
  /** Padding bottom for content when feed is loaded */
  CONTENT_PADDING_BOTTOM: 'pb-24',
  /** Shadow for floating buttons */
  BUTTON_SHADOW: 'shadow-lg',
  /** Fixed positioning classes for download button */
  FIXED_BOTTOM_CENTER: 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
} as const;

/** Field name patterns for field type detection */
export const FIELD_PATTERNS = {
  LINK: ['link'],
  IMAGE: ['image', 'img', 'enclosure'],
  DATE: ['date', 'time'],
  LONG_TEXT: ['description', 'content', 'summary'],
} as const;

