/**
 * Utility functions for retrying operations with exponential backoff
 */

/**
 * Sleeps for the specified number of milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Options for retry operation
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;
  /** Base delay in milliseconds for exponential backoff (default: 1000) */
  baseDelayMs?: number;
  /** Whether to use exponential backoff (default: true) */
  exponentialBackoff?: boolean;
  /** Function to determine if an error should trigger a retry */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  exponentialBackoff: true,
  shouldRetry: () => true,
};

/**
 * Calculates delay for retry attempt using exponential backoff
 *
 * @param attemptNumber - Current attempt number (0-indexed)
 * @param baseDelayMs - Base delay in milliseconds
 * @returns Delay in milliseconds
 */
function calculateRetryDelay(attemptNumber: number, baseDelayMs: number): number {
  // Exponential backoff: baseDelayMs * 2^attemptNumber
  return baseDelayMs * Math.pow(2, attemptNumber);
}

/**
 * Retries an async operation with exponential backoff
 *
 * @param operation - Async operation to retry
 * @param options - Retry configuration options
 * @returns Result of the operation
 * @throws Last error if all retries fail
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   async () => fetch(url),
 *   { maxAttempts: 3, baseDelayMs: 1000 }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!config.shouldRetry(error, attempt)) {
        throw error;
      }

      // Don't delay after the last attempt
      if (attempt < config.maxAttempts - 1) {
        const delay = config.exponentialBackoff
          ? calculateRetryDelay(attempt, config.baseDelayMs)
          : config.baseDelayMs;

        await sleep(delay);
      }
    }
  }

  // All retries exhausted, throw the last error
  throw lastError;
}

/**
 * Determines if an error is a retryable network error
 * Network errors, timeouts, and 5xx server errors are retryable
 * 4xx client errors (except timeout) are not retryable
 *
 * @param error - Error to check
 * @returns True if the error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  // Network errors and timeouts are retryable
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  if (error instanceof Error) {
    // AbortError (timeout) is retryable
    if (error.name === 'AbortError') {
      return true;
    }
  }

  // Check if it's an RssError object
  if (typeof error === 'object' && error !== null && 'type' in error) {
    const errorType = (error as { type: string }).type;

    // Only FETCH_ERROR types are retryable (not VALIDATION_ERROR, PARSE_ERROR, etc.)
    if (errorType === 'FETCH_ERROR') {
      // Extract status code from message if available
      const message = 'message' in error ? String(error.message) : '';
      
      // Don't retry on 4xx client errors (except 408 timeout and 429 rate limit)
      const statusMatch = message.match(/status:\s*(\d+)/i) || 
                         message.match(/\b(\d{3})\b/) ||
                         message.match(/(\d{3})\s+/);
      
      if (statusMatch) {
        const status = parseInt(statusMatch[1], 10);
        // Retry on 5xx errors, 408 timeout, and 429 rate limit
        // Don't retry on other 4xx errors
        return status >= 500 || status === 408 || status === 429;
      }
      
      // If we can't determine status from message, check for specific error messages
      // Timeout errors are retryable
      if (message.toLowerCase().includes('timeout')) {
        return true;
      }
      
      // Network errors are retryable, but validation/parse errors are not
      if (message.toLowerCase().includes('network') || 
          message.toLowerCase().includes('fetch')) {
        return true;
      }
      
      // Default: retry FETCH_ERROR if we can't determine otherwise
      return true;
    }

    // Non-FETCH_ERROR types (VALIDATION_ERROR, PARSE_ERROR, etc.) are not retryable
    return false;
  }

  return false;
}

