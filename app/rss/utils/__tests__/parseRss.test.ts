import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DOMParser } from '@xmldom/xmldom';
import { isValidUrl, parseRssXml } from '../parseRss';

// Mock DOMParser for browser environment
global.DOMParser = DOMParser as any;

describe('parseRss', () => {
  describe('isValidUrl', () => {
    it('should return true for valid HTTP URL', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('should return true for valid HTTPS URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
    });

    it('should return true for URL with path', () => {
      expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
    });

    it('should return true for URL with query parameters', () => {
      expect(isValidUrl('https://example.com?param=value')).toBe(true);
    });

    it('should return true for URL with port', () => {
      expect(isValidUrl('http://example.com:8080')).toBe(true);
    });

    it('should return false for FTP URL', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });

    it('should return false for file URL', () => {
      expect(isValidUrl('file:///path/to/file')).toBe(false);
    });

    it('should return false for invalid URL string', () => {
      expect(isValidUrl('not a url')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidUrl('')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidUrl(undefined as any)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidUrl(null as any)).toBe(false);
    });

    it('should return false for non-string', () => {
      expect(isValidUrl(123 as any)).toBe(false);
    });

    it('should handle URLs with whitespace', () => {
      expect(isValidUrl('  https://example.com  ')).toBe(true);
    });

    it('should return false for mailto URL', () => {
      expect(isValidUrl('mailto:test@example.com')).toBe(false);
    });
  });

  describe('parseRssXml', () => {
    it('should parse valid RSS 2.0 feed', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Test Feed</title>
            <description>Test Description</description>
            <link>https://example.com</link>
            <item>
              <title>Item 1</title>
              <description>Item Description</description>
              <link>https://example.com/item1</link>
            </item>
          </channel>
        </rss>`;

      const result = parseRssXml(xmlString);

      expect(result.error).toBeUndefined();
      expect(result.feed.feedType).toBe('rss');
      expect(result.feed.channelFields.title).toBe('Test Feed');
      expect(result.feed.channelFields.description).toBe('Test Description');
      expect(result.feed.items).toHaveLength(1);
      expect(result.feed.items[0].title).toBe('Item 1');
    });

    it('should parse valid Atom feed', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Atom Feed</title>
          <entry>
            <title>Entry 1</title>
            <link href="https://example.com/entry1"/>
          </entry>
        </feed>`;

      const result = parseRssXml(xmlString);

      expect(result.error).toBeUndefined();
      expect(result.feed.feedType).toBe('atom');
      expect(result.feed.channelFields.title).toBe('Atom Feed');
      expect(result.feed.items).toHaveLength(1);
    });

    it('should return error for invalid XML', () => {
      const xmlString = '<invalid><unclosed>';
      const result = parseRssXml(xmlString);

      expect(result.error).toBeDefined();
      // xmldom may return validation error instead of parse error
      expect(['PARSE_ERROR', 'VALIDATION_ERROR']).toContain(result.error?.type);
    });

    it('should return error for empty string', () => {
      const result = parseRssXml('');

      expect(result.error).toBeDefined();
      // xmldom may return validation error for empty string
      expect(['PARSE_ERROR', 'VALIDATION_ERROR']).toContain(result.error?.type);
    });

    it('should return error for non-XML content', () => {
      const result = parseRssXml('This is not XML');

      expect(result.error).toBeDefined();
      // xmldom may return validation error for non-XML
      expect(['PARSE_ERROR', 'VALIDATION_ERROR']).toContain(result.error?.type);
    });

    it('should parse feed with multiple items', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Multi Item Feed</title>
            <item>
              <title>Item 1</title>
            </item>
            <item>
              <title>Item 2</title>
            </item>
            <item>
              <title>Item 3</title>
            </item>
          </channel>
        </rss>`;

      const result = parseRssXml(xmlString);

      expect(result.error).toBeUndefined();
      expect(result.feed.items).toHaveLength(3);
    });

    it('should handle RSS feed with namespaced elements', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Feed</title>
            <item>
              <title>Item</title>
              <media:content url="https://example.com/image.jpg"/>
            </item>
          </channel>
        </rss>`;

      const result = parseRssXml(xmlString);

      expect(result.error).toBeUndefined();
      expect(result.feed.items[0].content).toBeDefined();
    });
  });
});

