import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import type { ParsedRssData } from '../../../rss/types/rss';

// Mock the parseRssXmlServer function
vi.mock('../../../rss/utils/parseRssServer', () => ({
  parseRssXmlServer: vi.fn(),
}));

// Mock the isValidUrl function
vi.mock('../../../rss/utils/parseRss', () => ({
  isValidUrl: vi.fn(),
}));

import { parseRssXmlServer } from '../../../rss/utils/parseRssServer';
import { isValidUrl } from '../../../rss/utils/parseRss';

describe('RSS API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST', () => {
    it('should return parsed RSS data for valid request', async () => {
      const mockFeed = {
        feedType: 'rss' as const,
        channelFields: { title: 'Test Feed' },
        items: [{ title: 'Item 1' }],
      };

      const mockXml = '<?xml version="1.0"?><rss></rss>';

      vi.mocked(isValidUrl).mockReturnValue(true);
      vi.mocked(parseRssXmlServer).mockReturnValue({ feed: mockFeed });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => mockXml,
      } as Response);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data.data.feed).toEqual(mockFeed);
      expect(data.data.rawXml).toBe(mockXml);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/feed.xml',
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': expect.any(String),
            Accept: expect.any(String),
          }),
        })
      );
    });

    it('should return 400 for invalid JSON body', async () => {
      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error.type).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for missing URL', async () => {
      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('VALIDATION_ERROR');
      expect(data.error.message).toContain('valid RSS feed URL');
    });

    it('should return 400 for empty URL', async () => {
      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: '' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid URL format', async () => {
      vi.mocked(isValidUrl).mockReturnValue(false);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'not-a-url' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('INVALID_URL');
    });

    it('should return 400 for non-HTTP/HTTPS URL', async () => {
      vi.mocked(isValidUrl).mockReturnValue(false);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'ftp://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('INVALID_URL');
    });

    it('should return 400 for fetch timeout', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';

      global.fetch = vi.fn().mockRejectedValue(abortError);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('FETCH_ERROR');
      expect(data.error.message).toContain('timeout');
    });

    it('should return 400 for non-OK HTTP response', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => '',
      } as Response);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('FETCH_ERROR');
      expect(data.error.message).toContain('404');
    });

    it('should return 500 for server errors (5xx)', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => '',
      } as Response);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.type).toBe('FETCH_ERROR');
    });

    it('should return 400 for empty XML response', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => '',
      } as Response);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('FETCH_ERROR');
      expect(data.error.message).toContain('empty content');
    });

    it('should return 400 for parse errors', async () => {
      const mockXml = '<?xml version="1.0"?><rss></rss>';

      vi.mocked(isValidUrl).mockReturnValue(true);
      vi.mocked(parseRssXmlServer).mockReturnValue({
        feed: { feedType: 'rss', channelFields: {}, items: [] },
        error: {
          message: 'Parse error',
          type: 'PARSE_ERROR',
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => mockXml,
      } as Response);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.type).toBe('PARSE_ERROR');
    });

    it('should return 500 for unexpected errors', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.type).toBe('FETCH_ERROR');
      expect(data.error.message).toContain('Network error');
    });

    it('should trim URL before validation', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      const mockFeed = {
        feedType: 'rss' as const,
        channelFields: {},
        items: [],
      };

      vi.mocked(parseRssXmlServer).mockReturnValue({ feed: mockFeed });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => '<?xml version="1.0"?><rss></rss>',
      } as Response);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: '  https://example.com/feed.xml  ' }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/feed.xml',
        expect.any(Object)
      );
    });

    it('should set correct headers in fetch request', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      const mockFeed = {
        feedType: 'rss' as const,
        channelFields: {},
        items: [],
      };

      vi.mocked(parseRssXmlServer).mockReturnValue({ feed: mockFeed });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => '<?xml version="1.0"?><rss></rss>',
      } as Response);

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': expect.any(String),
            Accept: expect.any(String),
          }),
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(isValidUrl).mockReturnValue(true);

      global.fetch = vi.fn().mockRejectedValue('String error');

      const request = new NextRequest('http://localhost/api/rss', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.type).toBe('FETCH_ERROR');
      expect(data.error.message).toContain('unexpected error');
    });
  });
});

