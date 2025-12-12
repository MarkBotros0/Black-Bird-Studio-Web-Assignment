'use client';

import { useState, useCallback } from 'react';
import { generateRssXml, downloadXmlFile } from '../utils/generateRssXml';
import type { RssFeed, RssError, RssItem, ParsedRssData } from '../types/rss';
import { RSS_API_ROUTE, REQUEST_TIMEOUT_MS, MAX_RETRY_ATTEMPTS, RETRY_BASE_DELAY_MS } from '../constants';
import { generateXmlFilename } from '../utils/filenameUtils';
import {
  createValidationError,
  createFetchError,
  createGenerationError,
  createNetworkError,
} from '../utils/errorUtils';
import { retryWithBackoff, isRetryableError } from '../utils/retry';

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
   * Validates and trims the feed URL
   *
   * @param feedUrl - URL to validate
   * @returns Trimmed URL or sets error and returns empty string
   */
  const validateFeedUrl = useCallback((feedUrl: string): string => {
    const trimmedUrl = feedUrl.trim();

    if (!trimmedUrl) {
      setError(createValidationError('Please enter an RSS feed URL.'));
      return '';
    }

    return trimmedUrl;
  }, []);

  /**
   * Creates a timeout controller for fetch requests
   *
   * @returns Object containing abort controller and timeout ID
   */
  const createFetchTimeout = useCallback((): {
    controller: AbortController;
    timeoutId: NodeJS.Timeout;
  } => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    return { controller, timeoutId };
  }, []);

  /**
   * Checks if an error is a timeout error
   *
   * @param error - Error from fetch operation
   * @returns True if error is a timeout, false otherwise
   */
  const isTimeoutError = useCallback((error: unknown): boolean => {
    return error instanceof Error && error.name === 'AbortError';
  }, []);

  /**
   * Performs the actual fetch request to the RSS API
   *
   * @param url - URL to fetch
   * @returns Response object or throws error
   */
  const performFetch = useCallback(async (url: string): Promise<Response> => {
    const { controller, timeoutId } = createFetchTimeout();

    try {
      const response = await fetch(RSS_API_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (isTimeoutError(fetchError)) {
        throw createFetchError('Request timeout. Please try again.');
      }
      throw fetchError;
    }
  }, [createFetchTimeout, isTimeoutError]);

  /**
   * Extracts error data from a failed response
   *
   * @param response - Failed response object
   * @returns Error object or undefined
   */
  const extractResponseError = useCallback(async (response: Response): Promise<RssError> => {
    let errorData: RssError | undefined;
    try {
      const errorResult = await response.json();
      errorData = errorResult.error;
    } catch {
      // JSON parsing failed, use default error
    }

    return (
      errorData || createFetchError(
        `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
      )
    );
  }, []);

  /**
   * Handles successful API response
   *
   * @param result - Parsed response data
   */
  const handleSuccessfulResponse = useCallback((result: {
    data?: ParsedRssData;
    error?: RssError;
  }): void => {
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setFeed(result.data.feed);
      setError(null);
    } else {
      setError(createFetchError('Invalid response from server.'));
    }
  }, []);

  /**
   * Performs a single fetch attempt with error extraction
   *
   * @param url - URL to fetch
   * @returns Parsed response data or throws error
   */
  const performFetchAttempt = useCallback(async (url: string): Promise<ParsedRssData> => {
    const response = await performFetch(url);

    if (!response.ok) {
      const errorData = await extractResponseError(response);
      throw errorData;
    }

    const result: { data?: ParsedRssData; error?: RssError } = await response.json();

    if (result.error) {
      throw result.error;
    }

    if (!result.data) {
      throw createFetchError('Invalid response from server.');
    }

    return result.data;
  }, [performFetch, extractResponseError]);

  /**
   * Internal function to fetch RSS feed from a URL with retry logic
   */
  const fetchFeed = useCallback(async (feedUrl: string) => {
    const trimmedUrl = validateFeedUrl(feedUrl);
    if (!trimmedUrl) {
      return;
    }

    setLoading(true);
    setError(null);
    setFeed(null);
    setUrl(trimmedUrl);

    try {
      // Retry fetch operation up to MAX_RETRY_ATTEMPTS times
      const data = await retryWithBackoff(
        () => performFetchAttempt(trimmedUrl),
        {
          maxAttempts: MAX_RETRY_ATTEMPTS,
          baseDelayMs: RETRY_BASE_DELAY_MS,
          exponentialBackoff: true,
          shouldRetry: (error) => isRetryableError(error),
        }
      );

      // Success - set feed data
      setFeed(data.feed);
      setError(null);
    } catch (err) {
      // All retries exhausted or non-retryable error
      let finalError: RssError;

      if (err && typeof err === 'object' && 'type' in err && 'message' in err) {
        finalError = err as RssError;
        // Update error message to indicate retries were attempted
        if (isRetryableError(err)) {
          finalError = createFetchError(
            `${finalError.message} (Attempted ${MAX_RETRY_ATTEMPTS} times)`
          );
        }
      } else {
        finalError = createNetworkError(err, 'An unexpected error occurred');
      }

      setError(finalError);
    } finally {
      setLoading(false);
    }
  }, [validateFeedUrl, performFetchAttempt]);

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
      setError(
        createGenerationError(
          error instanceof Error ? error.message : 'Failed to generate XML file'
        )
      );
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

