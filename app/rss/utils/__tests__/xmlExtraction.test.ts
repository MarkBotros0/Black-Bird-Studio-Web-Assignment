import { describe, it, expect } from 'vitest';
import { DOMParser } from '@xmldom/xmldom';
import { extractElementFields } from '../xmlExtraction';

describe('xmlExtraction', () => {
  describe('extractElementFields', () => {
    it('should extract fields from element with children', () => {
      const xmlString = `
        <item>
          <title>Test Title</title>
          <description>Test Description</description>
          <link>https://example.com</link>
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result).toEqual({
        title: 'Test Title',
        description: 'Test Description',
        link: 'https://example.com',
      });
    });

    it('should handle elements with attributes', () => {
      const xmlString = `
        <item>
          <link href="https://example.com">Example Link</link>
          <media:content url="https://example.com/image.jpg" type="image/jpeg">Image</media:content>
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result.link).toContain('"text":"Example Link"');
      expect(result.link).toContain('"href":"https://example.com"');
      expect(result.content).toContain('"text":"Image"');
      expect(result.content).toContain('"url":"https://example.com/image.jpg"');
    });

    it('should remove namespace prefixes from tag names', () => {
      const xmlString = `
        <item>
          <media:title>Media Title</media:title>
          <dc:creator>John Doe</dc:creator>
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result.title).toBe('Media Title');
      expect(result.creator).toBe('John Doe');
    });

    it('should handle empty elements', () => {
      const xmlString = '<item></item>';
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result).toEqual({});
    });

    it('should handle elements with only whitespace', () => {
      const xmlString = `
        <item>
          <title>   </title>
          <description>Valid Content</description>
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result.title).toBeUndefined();
      expect(result.description).toBe('Valid Content');
    });

    it('should handle elements with multiple attributes', () => {
      const xmlString = `
        <item>
          <enclosure url="https://example.com/file.mp3" type="audio/mpeg" length="12345" />
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result.enclosure).toContain('"url":"https://example.com/file.mp3"');
      expect(result.enclosure).toContain('"type":"audio/mpeg"');
      expect(result.enclosure).toContain('"length":"12345"');
    });

    it('should handle mixed plain text and attributes', () => {
      const xmlString = `
        <item>
          <title>Plain Title</title>
          <link href="https://example.com">Link Text</link>
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result.title).toBe('Plain Title');
      expect(result.link).toContain('"text":"Link Text"');
      expect(result.link).toContain('"href":"https://example.com"');
    });

    it('should handle nested elements correctly', () => {
      const xmlString = `
        <item>
          <title>Title</title>
          <author>
            <name>John Doe</name>
            <email>john@example.com</email>
          </author>
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result.title).toBe('Title');
      // Nested elements should be extracted as JSON if they have attributes
      // or as plain text if they don't
      expect(result.author).toBeDefined();
    });

    it('should handle special characters in text content', () => {
      const xmlString = `
        <item>
          <title>Title &amp; Description</title>
          <description>Text with &lt;tags&gt; and "quotes"</description>
        </item>
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const item = doc.getElementsByTagName('item')[0] as Element;

      const result = extractElementFields(item);

      expect(result.title).toBe('Title & Description');
      expect(result.description).toContain('tags');
    });
  });
});

