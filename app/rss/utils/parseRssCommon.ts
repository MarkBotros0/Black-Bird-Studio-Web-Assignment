import type { RssItem, RssFeed, RssError } from '../types/rss';
import { XML_TAGS } from '../constants';
import { extractElementFields } from './xmlExtraction';

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
    return {
      feed: { channelFields: {}, items: [], feedType: 'rss' },
      error: {
        message: 'Invalid XML format. Please check the RSS feed structure.',
        type: 'PARSE_ERROR',
      },
    };
  }

  const rssChannel = getElementByTagName(xmlDoc, XML_TAGS.CHANNEL);
  if (rssChannel) {
    const channelFields = extractElementFields(rssChannel);
    const itemElements = getElementsByTagName(rssChannel, XML_TAGS.ITEM);
    const items: RssItem[] = itemElements.map((item) => extractElementFields(item));

    if (items.length === 0) {
      return {
        feed: { channelFields, items: [], feedType: 'rss' },
        error: {
          message: 'RSS feed contains no items.',
          type: 'VALIDATION_ERROR',
        },
      };
    }

    return {
      feed: {
        channelFields,
        items,
        feedType: 'rss',
      },
    };
  }

  const atomFeed = getElementByTagName(xmlDoc, XML_TAGS.FEED);
  if (atomFeed) {
    const channelFields = extractElementFields(atomFeed);
    const entryElements = getElementsByTagName(atomFeed, XML_TAGS.ENTRY);
    const items: RssItem[] = entryElements.map((entry) => extractElementFields(entry));

    if (items.length === 0) {
      return {
        feed: { channelFields, items: [], feedType: 'atom' },
        error: {
          message: 'Atom feed contains no entries.',
          type: 'VALIDATION_ERROR',
        },
      };
    }

    return {
      feed: {
        channelFields,
        items,
        feedType: 'atom',
      },
    };
  }

  return {
    feed: { channelFields: {}, items: [], feedType: 'rss' },
    error: {
      message: 'Feed format not recognized. Expected RSS 2.0 or Atom format.',
      type: 'VALIDATION_ERROR',
    },
  };
}

