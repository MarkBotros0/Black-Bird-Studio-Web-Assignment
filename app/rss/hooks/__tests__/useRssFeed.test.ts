import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useRssFeed } from '../useRssFeed';
import type { RssFeed, RssItem, ParsedRssData } from '../../types/rss';
import { RSS_API_ROUTE } from '../../constants';

// Mock dependencies
vi.mock('../../utils/generateRssXml', () => ({
    generateRssXml: vi.fn((feed: RssFeed) => '<?xml version="1.0"?><rss>...</rss>'),
    downloadXmlFile: vi.fn(),
}));

vi.mock('../../utils/filenameUtils', () => ({
    generateXmlFilename: vi.fn((title: string) => `${title}.xml`),
}));

describe('useRssFeed', () => {
    const mockFeed: RssFeed = {
        channelFields: {
            title: 'Test Feed',
            description: 'Test Description',
            link: 'https://example.com',
        },
        items: [
            { title: 'Item 1', description: 'Description 1' },
            { title: 'Item 2', description: 'Description 2' },
        ],
        feedType: 'rss',
    };

    const mockParsedData: ParsedRssData = {
        feed: mockFeed,
        rawXml: '<?xml version="1.0"?><rss>...</rss>',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('initial state', () => {
        it('should initialize with empty state', () => {
            const { result } = renderHook(() => useRssFeed());

            expect(result.current.url).toBe('');
            expect(result.current.feed).toBeNull();
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBeNull();
        });
    });

    describe('setUrl', () => {
        it('should update URL state', () => {
            const { result } = renderHook(() => useRssFeed());

            act(() => {
                result.current.setUrl('https://example.com/feed.xml');
            });

            expect(result.current.url).toBe('https://example.com/feed.xml');
        });
    });

    describe('handleFetchUrl', () => {
        it('should fetch feed successfully', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({ data: mockParsedData }),
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockResponse as Response
            );

            const { result } = renderHook(() => useRssFeed());

            await act(async () => {
                await result.current.handleFetchUrl('https://example.com/feed.xml');
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.feed).toEqual(mockFeed);
            expect(result.current.error).toBeNull();
            expect(result.current.url).toBe('https://example.com/feed.xml');
            expect(global.fetch).toHaveBeenCalledWith(
                RSS_API_ROUTE,
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
                })
            );
        });

        it('should handle fetch errors', async () => {
            const mockError = new Error('Network error');
            (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
                mockError
            );

            const { result } = renderHook(() => useRssFeed());

            await act(async () => {
                await result.current.handleFetchUrl('https://example.com/feed.xml');
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.feed).toBeNull();
            expect(result.current.error).toBeTruthy();
            expect(result.current.error?.type).toBe('FETCH_ERROR');
        });

        it('should handle validation errors', async () => {
            const { result } = renderHook(() => useRssFeed());

            await act(async () => {
                await result.current.handleFetchUrl('');
            });

            expect(result.current.error).toBeTruthy();
            expect(result.current.error?.type).toBe('VALIDATION_ERROR');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should handle API error responses', async () => {
            const mockErrorResponse = {
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: async () => ({
                    error: {
                        message: 'Feed not found',
                        type: 'FETCH_ERROR',
                    },
                }),
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockErrorResponse as Response
            );

            const { result } = renderHook(() => useRssFeed());

            await act(async () => {
                await result.current.handleFetchUrl('https://example.com/feed.xml');
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.feed).toBeNull();
            expect(result.current.error).toBeTruthy();
            expect(result.current.error?.type).toBe('FETCH_ERROR');
            // The error message might be wrapped, so just check it exists
            expect(result.current.error?.message).toBeTruthy();
        });

        it('should set loading state during fetch', async () => {
            let resolveFetch: (value: Response) => void;
            const fetchPromise = new Promise<Response>((resolve) => {
                resolveFetch = resolve;
            });

            (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
                fetchPromise
            );

            const { result } = renderHook(() => useRssFeed());

            act(() => {
                result.current.handleFetchUrl('https://example.com/feed.xml');
            });

            // Should be loading
            expect(result.current.loading).toBe(true);

            // Resolve fetch
            await act(async () => {
                resolveFetch!({
                    ok: true,
                    json: async () => ({ data: mockParsedData }),
                } as Response);
                await fetchPromise;
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });
    });

    describe('handleItemsChange', () => {
        it('should update feed items', async () => {
            const { result } = renderHook(() => useRssFeed());

            // First set a feed
            act(() => {
                result.current.setUrl('https://example.com/feed.xml');
            });

            const mockResponse = {
                ok: true,
                json: async () => ({ data: mockParsedData }),
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockResponse as Response
            );

            await act(async () => {
                await result.current.handleFetchUrl('https://example.com/feed.xml');
            });

            await waitFor(() => {
                expect(result.current.feed).not.toBeNull();
            });

            const newItems: RssItem[] = [
                { title: 'New Item 1' },
                { title: 'New Item 2' },
            ];

            act(() => {
                result.current.handleItemsChange(newItems);
            });

            expect(result.current.feed?.items).toEqual(newItems);
        });

        it('should handle items change when feed is null', () => {
            const { result } = renderHook(() => useRssFeed());

            const newItems: RssItem[] = [{ title: 'New Item' }];

            act(() => {
                result.current.handleItemsChange(newItems);
            });

            // Should not crash, feed should remain null
            expect(result.current.feed).toBeNull();
        });
    });

    describe('handleGenerateXml', () => {
        it('should generate and download XML when feed exists', async () => {
            const { generateRssXml, downloadXmlFile } = await import(
                '../../utils/generateRssXml'
            );
            const { generateXmlFilename } = await import(
                '../../utils/filenameUtils'
            );

            const { result } = renderHook(() => useRssFeed());

            // Set up feed
            const mockResponse = {
                ok: true,
                json: async () => ({ data: mockParsedData }),
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockResponse as Response
            );

            await act(async () => {
                await result.current.handleFetchUrl('https://example.com/feed.xml');
            });

            await waitFor(() => {
                expect(result.current.feed).not.toBeNull();
            });

            act(() => {
                result.current.handleGenerateXml();
            });

            expect(generateRssXml).toHaveBeenCalledWith(mockFeed);
            expect(generateXmlFilename).toHaveBeenCalled();
            expect(downloadXmlFile).toHaveBeenCalled();
        });

        it('should not generate XML when feed is null', () => {
            const { result } = renderHook(() => useRssFeed());

            act(() => {
                result.current.handleGenerateXml();
            });

            // Should not crash, nothing should happen
            expect(result.current.feed).toBeNull();
        });

        it('should handle XML generation errors', async () => {
            const { generateRssXml } = await import('../../utils/generateRssXml');
            vi.mocked(generateRssXml).mockImplementationOnce(() => {
                throw new Error('Generation failed');
            });

            const { result } = renderHook(() => useRssFeed());

            // Set up feed
            const mockResponse = {
                ok: true,
                json: async () => ({ data: mockParsedData }),
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockResponse as Response
            );

            await act(async () => {
                await result.current.handleFetchUrl('https://example.com/feed.xml');
            });

            await waitFor(() => {
                expect(result.current.feed).not.toBeNull();
            });

            act(() => {
                result.current.handleGenerateXml();
            });

            expect(result.current.error).toBeTruthy();
            expect(result.current.error?.type).toBe('GENERATION_ERROR');
        });
    });

    describe('handleFetch', () => {
        it('should fetch using current URL', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({ data: mockParsedData }),
            };

            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockResponse as Response
            );

            const { result } = renderHook(() => useRssFeed());

            act(() => {
                result.current.setUrl('https://example.com/feed.xml');
            });

            await act(async () => {
                await result.current.handleFetch();
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.feed).toEqual(mockFeed);
            expect(global.fetch).toHaveBeenCalledWith(
                RSS_API_ROUTE,
                expect.objectContaining({
                    body: JSON.stringify({ url: 'https://example.com/feed.xml' }),
                })
            );
        });
    });
});

