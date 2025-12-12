import type { RssItem, RssFeed, RssError } from '../types/rss';
import { XML_TAGS } from '../constants';
import { extractElementFields } from './xmlExtraction';
import {
  createParseErrorResult,
  createValidationErrorResult,
} from './errorUtils';

/**
 * Common interface for XML document access (works with both browser DOM and xmldom)
 */
interface XmlDocument {
  querySelector?(selector: string): Element | null;
  querySelectorAll?(selector: string): NodeListOf<Element>;
  getElementsByTagName?(tagName: string): HTMLCollectionOf<Element> | NodeListOf<Element>;
}

/**
 * Common interface for XML element access
 */
interface XmlElement {
  querySelector?(selector: string): Element | null;
  querySelectorAll?(selector: string): NodeListOf<Element>;
  getElementsByTagName?(tagName: string): HTMLCollectionOf<Element> | NodeListOf<Element>;
}

/**
 * Checks for parser errors in XML document
 * Works with both browser DOM and xmldom
 * 
 * @param doc - XML document to check
 * @returns True if parser errors are detected
 */
function hasParseError(doc: XmlDocument): boolean {
  if (!doc) return false;

  if (doc.querySelector) {
    return doc.querySelector(XML_TAGS.PARSER_ERROR) !== null;
  }
  
  if (doc.getElementsByTagName) {
    const errors = doc.getElementsByTagName(XML_TAGS.PARSER_ERROR);
    return errors.length > 0;
  }
  
  return false;
}

/**
 * Gets elements by tag name (works with both browser DOM and xmldom)
 * 
 * @param parent - Parent element or document to search in
 * @param tagName - Tag name to search for
 * @returns Array of matching elements
 */
function getElementsByTagName(
  parent: XmlElement | XmlDocument,
  tagName: string
): Element[] {
  if (!parent || !tagName) return [];

  if (parent.querySelectorAll) {
    return Array.from(parent.querySelectorAll(tagName));
  }
  if (parent.getElementsByTagName) {
    const collection = parent.getElementsByTagName(tagName);
    return Array.from(collection);
  }
  return [];
}

/**
 * Gets a single element by tag name (works with both browser DOM and xmldom)
 * 
 * @param parent - Parent element or document to search in
 * @param tagName - Tag name to search for
 * @returns First matching element or null
 */
function getElementByTagName(
  parent: XmlElement | XmlDocument,
  tagName: string
): Element | null {
  if (!parent || !tagName) return null;

  if (parent.querySelector) {
    return parent.querySelector(tagName);
  }
  if (parent.getElementsByTagName) {
    const collection = parent.getElementsByTagName(tagName);
    return collection.length > 0 ? (collection[0] as Element) : null;
  }
  return null;
}


/**
 * Parses RSS 2.0 feed format
 *
 * @param xmlDoc - Parsed XML document
 * @returns Parsed RSS feed data or error
 */
function parseRssFeed(xmlDoc: XmlDocument): { feed: RssFeed; error?: RssError } | null {
  const rssChannel = getElementByTagName(xmlDoc, XML_TAGS.CHANNEL);
  if (!rssChannel) {
    return null;
  }

  const channelFields = extractElementFields(rssChannel);
  const itemElements = getElementsByTagName(rssChannel, XML_TAGS.ITEM);
  const items: RssItem[] = itemElements.map((item) => extractElementFields(item));

  if (items.length === 0) {
    return createValidationErrorResult('RSS feed contains no items.', 'rss', channelFields);
  }

  return {
    feed: {
      channelFields,
      items,
      feedType: 'rss',
    },
  };
}

/**
 * Parses Atom feed format
 *
 * @param xmlDoc - Parsed XML document
 * @returns Parsed Atom feed data or error
 */
function parseAtomFeed(xmlDoc: XmlDocument): { feed: RssFeed; error?: RssError } | null {
  const atomFeed = getElementByTagName(xmlDoc, XML_TAGS.FEED);
  if (!atomFeed) {
    return null;
  }

  const channelFields = extractElementFields(atomFeed);
  const entryElements = getElementsByTagName(atomFeed, XML_TAGS.ENTRY);
  const items: RssItem[] = entryElements.map((entry) => extractElementFields(entry));

  if (items.length === 0) {
    return createValidationErrorResult('Atom feed contains no entries.', 'atom', channelFields);
  }

  return {
    feed: {
      channelFields,
      items,
      feedType: 'atom',
    },
  };
}

/**
 * Common RSS parsing logic (extracted to reduce duplication)
 * Works with both browser DOM and xmldom
 *
 * @param xmlDoc - Parsed XML document
 * @returns Parsed feed data or error
 */
export function parseRssXmlCommon(
  xmlDoc: XmlDocument
): { feed: RssFeed; error?: RssError } {
  if (hasParseError(xmlDoc)) {
    return createParseErrorResult('Invalid XML format. Please check the RSS feed structure.');
  }

  // Try parsing as RSS 2.0 first
  const rssResult = parseRssFeed(xmlDoc);
  if (rssResult) {
    return rssResult;
  }

  // Try parsing as Atom
  const atomResult = parseAtomFeed(xmlDoc);
  if (atomResult) {
    return atomResult;
  }

  // Neither format recognized
  return createValidationErrorResult(
    'Feed format not recognized. Expected RSS 2.0 or Atom format.'
  );
}

