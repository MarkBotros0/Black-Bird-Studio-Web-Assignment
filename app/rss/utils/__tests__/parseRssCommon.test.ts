import { describe, it, expect } from 'vitest';
import { parseRssXmlCommon } from '../parseRssCommon';
import { DOMParser } from '@xmldom/xmldom';

describe('parseRssCommon', () => {
  describe('parseRssXmlCommon', () => {
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

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeUndefined();
      expect(result.feed.feedType).toBe('rss');
      expect(result.feed.channelFields.title).toBe('Test Feed');
      expect(result.feed.items).toHaveLength(1);
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

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeUndefined();
      expect(result.feed.feedType).toBe('atom');
      expect(result.feed.channelFields.title).toBe('Atom Feed');
      expect(result.feed.items).toHaveLength(1);
    });

    it('should return validation error for invalid XML (xmldom handles it differently)', () => {
      const xmlString = '<invalid><unclosed>';
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeDefined();
      // xmldom may return validation error instead of parse error for malformed XML
      expect(['PARSE_ERROR', 'VALIDATION_ERROR']).toContain(result.error?.type);
    });

    it('should return validation error for RSS feed with no items', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Empty Feed</title>
          </channel>
        </rss>`;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('no items');
      expect(result.feed.channelFields.title).toBe('Empty Feed');
    });

    it('should return validation error for Atom feed with no entries', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Empty Atom Feed</title>
        </feed>`;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('no entries');
      expect(result.feed.channelFields.title).toBe('Empty Atom Feed');
    });

    it('should return validation error for unrecognized format', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <custom>
          <data>Not RSS or Atom</data>
        </custom>`;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('not recognized');
    });

    it('should parse RSS feed with multiple items', () => {
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

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeUndefined();
      expect(result.feed.items).toHaveLength(3);
    });

    it('should parse Atom feed with multiple entries', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Multi Entry Feed</title>
          <entry>
            <title>Entry 1</title>
          </entry>
          <entry>
            <title>Entry 2</title>
          </entry>
        </feed>`;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeUndefined();
      expect(result.feed.items).toHaveLength(2);
    });

    it('should extract all channel fields', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Feed Title</title>
            <description>Feed Description</description>
            <link>https://example.com</link>
            <language>en</language>
            <copyright>Copyright 2024</copyright>
            <item>
              <title>Item</title>
            </item>
          </channel>
        </rss>`;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeUndefined();
      expect(result.feed.channelFields.title).toBe('Feed Title');
      expect(result.feed.channelFields.description).toBe('Feed Description');
      expect(result.feed.channelFields.link).toBe('https://example.com');
      expect(result.feed.channelFields.language).toBe('en');
      expect(result.feed.channelFields.copyright).toBe('Copyright 2024');
    });

    it('should extract all item fields', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Feed</title>
            <item>
              <title>Item Title</title>
              <description>Item Description</description>
              <link>https://example.com/item</link>
              <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
              <author>John Doe</author>
            </item>
          </channel>
        </rss>`;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const result = parseRssXmlCommon(xmlDoc as any);

      expect(result.error).toBeUndefined();
      const item = result.feed.items[0];
      expect(item.title).toBe('Item Title');
      expect(item.description).toBe('Item Description');
      expect(item.link).toBe('https://example.com/item');
      expect(item.pubDate).toBe('Mon, 01 Jan 2024 00:00:00 GMT');
      expect(item.author).toBe('John Doe');
    });
  });
});

