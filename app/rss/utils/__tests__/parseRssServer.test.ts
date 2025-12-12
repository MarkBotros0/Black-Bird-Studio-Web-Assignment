import { describe, it, expect } from 'vitest';
import { parseRssXmlServer } from '../parseRssServer';

describe('parseRssServer', () => {
  describe('parseRssXmlServer', () => {
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

      const result = parseRssXmlServer(xmlString);

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

      const result = parseRssXmlServer(xmlString);

      expect(result.error).toBeUndefined();
      expect(result.feed.feedType).toBe('atom');
      expect(result.feed.channelFields.title).toBe('Atom Feed');
      expect(result.feed.items).toHaveLength(1);
    });

    it('should return error for invalid XML', () => {
      const xmlString = '<invalid><unclosed>';
      const result = parseRssXmlServer(xmlString);

      expect(result.error).toBeDefined();
      // xmldom may return validation error instead of parse error
      expect(['PARSE_ERROR', 'VALIDATION_ERROR']).toContain(result.error?.type);
    });

    it('should return error for empty string', () => {
      const result = parseRssXmlServer('');

      expect(result.error).toBeDefined();
      // xmldom may return validation error for empty string
      expect(['PARSE_ERROR', 'VALIDATION_ERROR']).toContain(result.error?.type);
    });

    it('should return error for non-XML content', () => {
      const result = parseRssXmlServer('This is not XML');

      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('VALIDATION_ERROR');
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

      const result = parseRssXmlServer(xmlString);

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

      const result = parseRssXmlServer(xmlString);

      expect(result.error).toBeUndefined();
      expect(result.feed.items[0].content).toBeDefined();
    });

    it('should return validation error for feed with no items', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Empty Feed</title>
          </channel>
        </rss>`;

      const result = parseRssXmlServer(xmlString);

      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('no items');
    });

    it('should return validation error for unrecognized format', () => {
      const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <custom>
          <data>Not RSS or Atom</data>
        </custom>`;

      const result = parseRssXmlServer(xmlString);

      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('not recognized');
    });
  });
});

