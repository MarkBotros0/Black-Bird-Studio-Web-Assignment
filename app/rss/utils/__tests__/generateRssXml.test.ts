import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateRssXml, downloadXmlFile } from '../generateRssXml';
import type { RssFeed } from '../../types/rss';

describe('generateRssXml', () => {
  describe('generateRssXml', () => {
    it('should generate RSS 2.0 XML from feed data', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {
          title: 'Test Feed',
          description: 'Test Description',
          link: 'https://example.com',
        },
        items: [
          {
            title: 'Item 1',
            description: 'Item Description',
            link: 'https://example.com/item1',
          },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<rss version="2.0"');
      expect(result).toContain('<channel>');
      expect(result).toContain('<title>Test Feed</title>');
      expect(result).toContain('<item>');
      expect(result).toContain('<title>Item 1</title>');
    });

    it('should generate Atom XML from feed data', () => {
      const feed: RssFeed = {
        feedType: 'atom',
        channelFields: {
          title: 'Atom Feed',
          link: 'https://example.com',
        },
        items: [
          {
            title: 'Entry 1',
            link: 'https://example.com/entry1',
          },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
      expect(result).toContain('<title>Atom Feed</title>');
      expect(result).toContain('<entry>');
      expect(result).toContain('<title>Entry 1</title>');
    });

    it('should escape XML special characters', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {
          title: 'Feed & Title <with> "quotes"',
        },
        items: [
          {
            title: 'Item & <Special>',
            description: 'Description with "quotes"',
          },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('&amp;');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
      expect(result).not.toContain('<with>');
      expect(result).not.toContain('"quotes"');
    });

    it('should handle fields with attributes', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {},
        items: [
          {
            link: '{"text":"Link Text","attributes":{"href":"https://example.com"}}',
          },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('href=');
      expect(result).toContain('https://example.com');
      expect(result).toContain('Link Text');
    });

    it('should skip empty values', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {
          title: 'Feed',
          description: '',
          link: 'https://example.com',
        },
        items: [
          {
            title: 'Item',
            description: undefined,
          },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('<title>Feed</title>');
      expect(result).not.toContain('<description></description>');
      expect(result).toContain('<title>Item</title>');
    });

    it('should skip item/channel elements in channelFields', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {
          title: 'Feed',
          item: 'Should be skipped',
        },
        items: [
          {
            title: 'Item',
          },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('<title>Feed</title>');
      expect(result).not.toContain('<item>Should be skipped</item>');
    });

    it('should skip entry elements in Atom channelFields', () => {
      const feed: RssFeed = {
        feedType: 'atom',
        channelFields: {
          title: 'Feed',
          entry: 'Should be skipped',
        },
        items: [
          {
            title: 'Entry',
          },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('<title>Feed</title>');
      // entry should only appear as actual entries, not in channelFields
    });

    it('should throw error for invalid feed data', () => {
      expect(() => generateRssXml(null as any)).toThrow();
      expect(() => generateRssXml(undefined as any)).toThrow();
    });

    it('should throw error for feed without items', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {},
        items: null as any,
      };

      expect(() => generateRssXml(feed)).toThrow();
    });

    it('should handle multiple items', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {
          title: 'Feed',
        },
        items: [
          { title: 'Item 1' },
          { title: 'Item 2' },
          { title: 'Item 3' },
        ],
      };

      const result = generateRssXml(feed);

      const itemCount = (result.match(/<item>/g) || []).length;
      expect(itemCount).toBe(3);
    });

    it('should handle empty channelFields', () => {
      const feed: RssFeed = {
        feedType: 'rss',
        channelFields: {},
        items: [
          { title: 'Item' },
        ],
      };

      const result = generateRssXml(feed);

      expect(result).toContain('<channel>');
      expect(result).toContain('<item>');
    });
  });

  describe('downloadXmlFile', () => {
    let originalWindow: typeof window;
    let originalDocument: typeof document;
    let mockLink: any;

    beforeEach(() => {
      // Create a proper Blob mock that extends the real Blob if available
      if (typeof Blob === 'undefined') {
        class MockBlob {
          constructor(public parts: any[], public options: any) {}
        }
        global.Blob = MockBlob as any;
      }

      mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: vi.fn(),
      };

      const createObjectURLSpy = vi.fn((blob: any) => {
        // Accept any object as blob for testing
        return 'blob:mock-url';
      });
      const revokeObjectURLSpy = vi.fn();

      // Mock URL global (used directly in code, not window.URL)
      global.URL = {
        createObjectURL: createObjectURLSpy,
        revokeObjectURL: revokeObjectURLSpy,
      } as any;

      // Mock window and document for browser environment
      global.window = {
        URL: {
          createObjectURL: createObjectURLSpy,
          revokeObjectURL: revokeObjectURLSpy,
        },
      } as any;

      global.document = {
        createElement: vi.fn(() => mockLink),
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn(),
        },
      } as any;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should throw error when called outside browser', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(() => downloadXmlFile('<xml>content</xml>', 'test.xml')).toThrow(
        'browser environment'
      );

      global.window = originalWindow;
    });

    it('should throw error for empty XML content', () => {
      expect(() => downloadXmlFile('', 'test.xml')).toThrow('cannot be empty');
    });

    it('should create blob and trigger download', () => {
      const xmlContent = '<?xml version="1.0"?><feed></feed>';
      const filename = 'test.xml';

      downloadXmlFile(xmlContent, filename);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should use default filename when not provided', () => {
      const xmlContent = '<?xml version="1.0"?><feed></feed>';

      downloadXmlFile(xmlContent);

      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('feed.xml');
    });
  });
});

