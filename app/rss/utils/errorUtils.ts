/**
 * Centralized error handling utilities for consistent error creation
 */

import type { RssError, RssErrorType, RssFeed } from '../types/rss';

/**
 * Creates an empty RSS feed structure
 *
 * @param feedType - Type of feed ('rss' or 'atom')
 * @returns Empty RSS feed
 */
function createEmptyFeed(feedType: 'rss' | 'atom' = 'rss'): RssFeed {
  return { channelFields: {}, items: [], feedType };
}

/**
 * Creates an RssError object with the specified message and type
 *
 * @param message - Human-readable error message
 * @param type - Error type category
 * @returns RssError object
 *
 * @example
 * ```typescript
 * const error = createRssError('Failed to fetch feed', 'FETCH_ERROR');
 * ```
 */
export function createRssError(message: string, type: RssErrorType): RssError {
  return { message, type };
}

/**
 * Creates a parse error with a feed structure (for parser functions)
 *
 * @param message - Error message
 * @returns Object containing empty feed and parse error
 *
 * @example
 * ```typescript
 * const result = createParseErrorResult('Invalid XML format');
 * // result.feed is an empty feed, result.error is the parse error
 * ```
 */
export function createParseErrorResult(message: string): { feed: RssFeed; error: RssError } {
  return {
    feed: createEmptyFeed(),
    error: createRssError(message, 'PARSE_ERROR'),
  };
}

/**
 * Creates a validation error with a feed structure (for parser functions)
 *
 * @param message - Error message
 * @param feedType - Type of feed ('rss' or 'atom')
 * @param channelFields - Channel-level fields (if available)
 * @returns Object containing feed with channelFields and validation error
 *
 * @example
 * ```typescript
 * const result = createValidationErrorResult(
 *   'Feed contains no items',
 *   'rss',
 *   { title: 'My Feed' }
 * );
 * ```
 */
export function createValidationErrorResult(
  message: string,
  feedType: 'rss' | 'atom' = 'rss',
  channelFields: Record<string, string> = {}
): { feed: RssFeed; error: RssError } {
  return {
    feed: { channelFields, items: [], feedType },
    error: createRssError(message, 'VALIDATION_ERROR'),
  };
}

/**
 * Creates a parse error from an exception/unknown error
 * Extracts error message from Error objects, uses fallback for others
 *
 * @param error - Unknown error (Exception, Error, or other)
 * @param fallbackMessage - Default message if error cannot be extracted
 * @returns Object containing empty feed and parse error
 *
 * @example
 * ```typescript
 * try {
 *   parseXML(xml);
 * } catch (error) {
 *   return createParseErrorFromException(error);
 * }
 * ```
 */
export function createParseErrorFromException(
  error: unknown,
  fallbackMessage: string = 'Failed to parse RSS XML'
): { feed: RssFeed; error: RssError } {
  const message = error instanceof Error ? error.message : fallbackMessage;
  return createParseErrorResult(message);
}

/**
 * Creates a fetch error
 *
 * @param message - Error message
 * @returns RssError object with FETCH_ERROR type
 *
 * @example
 * ```typescript
 * const error = createFetchError('Request timeout');
 * ```
 */
export function createFetchError(message: string): RssError {
  return createRssError(message, 'FETCH_ERROR');
}

/**
 * Creates a validation error
 *
 * @param message - Error message
 * @returns RssError object with VALIDATION_ERROR type
 *
 * @example
 * ```typescript
 * const error = createValidationError('Invalid URL format');
 * ```
 */
export function createValidationError(message: string): RssError {
  return createRssError(message, 'VALIDATION_ERROR');
}

/**
 * Creates an invalid URL error
 *
 * @param message - Error message (optional, uses default if not provided)
 * @returns RssError object with INVALID_URL type
 *
 * @example
 * ```typescript
 * const error = createInvalidUrlError();
 * // or
 * const error = createInvalidUrlError('Please enter a valid HTTP or HTTPS URL');
 * ```
 */
export function createInvalidUrlError(message?: string): RssError {
  return createRssError(
    message || 'Please enter a valid HTTP or HTTPS URL.',
    'INVALID_URL'
  );
}

/**
 * Creates a generation error
 *
 * @param message - Error message
 * @returns RssError object with GENERATION_ERROR type
 *
 * @example
 * ```typescript
 * const error = createGenerationError('Failed to generate XML');
 * ```
 */
export function createGenerationError(message: string): RssError {
  return createRssError(message, 'GENERATION_ERROR');
}

/**
 * Creates a network error from an exception
 * Extracts error message from Error objects, uses fallback for others
 *
 * @param error - Unknown error (Exception, Error, or other)
 * @param fallbackMessage - Default message if error cannot be extracted
 * @returns RssError object with FETCH_ERROR type
 *
 * @example
 * ```typescript
 * try {
 *   await fetch(url);
 * } catch (error) {
 *   setError(createNetworkError(error));
 * }
 * ```
 */
export function createNetworkError(
  error: unknown,
  fallbackMessage: string = 'An unexpected network error occurred'
): RssError {
  const message =
    error instanceof Error
      ? `Network error: ${error.message}`
      : fallbackMessage;
  return createFetchError(message);
}

