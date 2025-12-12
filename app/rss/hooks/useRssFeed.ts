'use client';

import { useState, useCallback } from 'react';
import { generateRssXml, downloadXmlFile } from '../utils/generateRssXml';
import type { RssFeed, RssError, RssItem, ParsedRssData } from '../types/rss';
import { RSS_API_ROUTE, REQUEST_TIMEOUT_MS } from '../constants';
import { generateXmlFilename } from '../utils/filenameUtils';

/**
 * Return type for useRssFeed hook
 */
export interface UseRssFeedReturn {
  /** Current RSS feed URL */
  url: string;
  /** Setter for RSS feed URL */
  setUrl: (url: string) => void;
  /** Parsed RSS feed data */
  feed: RssFeed | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: RssError | null;
  /** Handler to fetch RSS feed */
  handleFetch: () => Promise<void>;
  /** Handler to fetch RSS feed from a specific URL */
  handleFetchUrl: (feedUrl: string) => Promise<void>;
  /** Handler to update RSS items */
  handleItemsChange: (items: RssItem[]) => void;
  /** Handler to generate and download XML */
  handleGenerateXml: () => void;
}

/**
 * Custom hook for managing RSS feed state and operations
 *
 * @returns Object containing RSS feed state and handlers
 */
export function useRssFeed(): UseRssFeedReturn {
  const [url, setUrl] = useState('');
  const [feed, setFeed] = useState<RssFeed | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RssError | null>(null);

  /**
   * Internal function to fetch RSS feed from a URL
   */
  const fetchFeed = useCallback(async (feedUrl: string) => {
    const trimmedUrl = feedUrl.trim();

    if (!trimmedUrl) {
      setError({
        message: 'Please enter an RSS feed URL.',
        type: 'VALIDATION_ERROR',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setFeed(null);
    setUrl(trimmedUrl);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch(RSS_API_ROUTE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: trimmedUrl }),
          signal: controller.signal,
        });
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timeout. Please try again.');
        }
        throw fetchError;
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        let errorData: RssError | undefined;
        try {
          const errorResult = await response.json();
          errorData = errorResult.error;
        } catch {
          // JSON parsing failed, use default error
        }

        setError(
          errorData || {
            message: `Failed to fetch RSS feed: ${response.status} ${response.statusText}`,
            type: 'FETCH_ERROR',
          }
        );
        return;
      }

      const result: { data?: ParsedRssData; error?: RssError } = await response.json();

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setFeed(result.data.feed);
        setError(null);
      } else {
        setError({
          message: 'Invalid response from server.',
          type: 'FETCH_ERROR',
        });
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        type: 'FETCH_ERROR',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetch = useCallback(async () => {
    await fetchFeed(url);
  }, [url, fetchFeed]);

  const handleFetchUrl = useCallback(async (feedUrl: string) => {
    await fetchFeed(feedUrl);
  }, [fetchFeed]);

  const handleItemsChange = useCallback((items: RssItem[]) => {
    setFeed((currentFeed) => {
      if (currentFeed) {
        return { ...currentFeed, items };
      }
      return null;
    });
  }, []);

  const handleGenerateXml = useCallback(() => {
    if (!feed) {
      return;
    }

    try {
      const xmlContent = generateRssXml(feed);
      const feedTitle = feed.channelFields.title || feed.channelFields.name;
      const filename = generateXmlFilename(feedTitle);
      downloadXmlFile(xmlContent, filename);
    } catch (error) {
      setError({
        message: error instanceof Error ? error.message : 'Failed to generate XML file',
        type: 'GENERATION_ERROR',
      });
    }
  }, [feed]);

  return {
    url,
    setUrl,
    feed,
    loading,
    error,
    handleFetch,
    handleFetchUrl,
    handleItemsChange,
    handleGenerateXml,
  };
}

