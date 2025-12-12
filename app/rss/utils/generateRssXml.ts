import type { RssFeed, ParsedFieldValue } from '../types/rss';
import { parseFieldValue } from './fieldParsing';
import { XML_NAMESPACES, XML_TAGS, URL_REVOKE_DELAY_MS } from '../constants';

/**
 * Escapes XML special characters to prevent injection attacks
 * Must escape & first to avoid double-escaping
 * 
 * @param unsafe - String containing potentially unsafe XML characters
 * @returns Escaped string safe for XML
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';

  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates XML element string from field key-value pair
 * 
 * @param key - XML element tag name
 * @param parsed - Parsed field value with text and optional attributes
 * @param indent - Indentation string for formatting
 * @returns XML element string
 */
function generateXmlElement(
  key: string,
  parsed: ParsedFieldValue,
  indent: string
): string {
  const escapedKey = escapeXml(key);
  const escapedText = escapeXml(parsed.text || '');

  if (parsed.attributes && Object.keys(parsed.attributes).length > 0) {
    const attrs = Object.entries(parsed.attributes)
      .map(([k, v]) => `${escapeXml(k)}="${escapeXml(String(v))}"`)
      .join(' ');
    return `${indent}<${escapedKey} ${attrs}>${escapedText}</${escapedKey}>`;
  }
  return `${indent}<${escapedKey}>${escapedText}</${escapedKey}>`;
}

/**
 * Generates RSS 2.0 or Atom XML from structured feed data (preserves all fields)
 * 
 * @param feed - Parsed RSS feed data structure
 * @returns Generated XML string
 */
export function generateRssXml(feed: RssFeed): string {
  if (!feed || !feed.items) {
    throw new Error('Invalid feed data: feed and items are required');
  }

  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>'];

  if (feed.feedType === 'atom') {
    lines.push(`<${XML_TAGS.FEED} xmlns="${XML_NAMESPACES.ATOM}">`);

    for (const [key, value] of Object.entries(feed.channelFields)) {
      if (key === XML_TAGS.ENTRY || !value) continue; // Skip entry elements and empty values
      const parsed = parseFieldValue(value);
      lines.push(generateXmlElement(key, parsed, '  '));
    }

    for (const item of feed.items) {
      lines.push(`  <${XML_TAGS.ENTRY}>`);
      for (const [key, value] of Object.entries(item)) {
        if (!value) continue;
        const parsed = parseFieldValue(value);
        lines.push(generateXmlElement(key, parsed, '    '));
      }
      lines.push(`  </${XML_TAGS.ENTRY}>`);
    }

    lines.push(`</${XML_TAGS.FEED}>`);
  } else {
    lines.push(`<${XML_TAGS.RSS} version="2.0" xmlns:atom="${XML_NAMESPACES.ATOM}">`);
    lines.push(`  <${XML_TAGS.CHANNEL}>`);

    for (const [key, value] of Object.entries(feed.channelFields)) {
      if (key === XML_TAGS.ITEM || !value) continue; // Skip item elements and empty values
      const parsed = parseFieldValue(value);
      lines.push(generateXmlElement(key, parsed, '    '));
    }

    for (const item of feed.items) {
      lines.push(`    <${XML_TAGS.ITEM}>`);
      for (const [key, value] of Object.entries(item)) {
        if (!value) continue;
        const parsed = parseFieldValue(value);
        lines.push(generateXmlElement(key, parsed, '      '));
      }
      lines.push(`    </${XML_TAGS.ITEM}>`);
    }

    lines.push(`  </${XML_TAGS.CHANNEL}>`);
    lines.push(`</${XML_TAGS.RSS}>`);
  }

  return lines.join('\n');
}

/**
 * Downloads XML content as a file in the browser
 * 
 * @param xmlContent - XML string content to download
 * @param filename - Filename for the downloaded file (default: 'feed.xml')
 * @throws Error if called outside browser environment
 */
export function downloadXmlFile(xmlContent: string, filename: string = 'feed.xml'): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('downloadXmlFile can only be called in browser environment');
  }

  if (!xmlContent) {
    throw new Error('XML content cannot be empty');
  }

  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), URL_REVOKE_DELAY_MS);
}
