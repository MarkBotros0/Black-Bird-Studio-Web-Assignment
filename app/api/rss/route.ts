import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl } from '../../rss/utils/parseRss';
import { parseRssXmlServer } from '../../rss/utils/parseRssServer';
import type { ParsedRssData, RssError } from '../../rss/types/rss';
import { RSS_USER_AGENT, RSS_ACCEPT_HEADERS, REQUEST_TIMEOUT_MS } from '../../rss/constants';
import {
  createValidationError,
  createInvalidUrlError,
  createFetchError,
  createNetworkError,
} from '../../rss/utils/errorUtils';

/**
 * Request body for RSS API route
 */
interface RssApiRequest {
  url: string;
}

/**
 * HTTP status codes
 */
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Converts an RssError to a NextResponse error response
 *
 * @param error - RssError object
 * @param statusCode - HTTP status code (defaults to BAD_REQUEST)
 * @returns NextResponse with error
 */
function createErrorResponse(error: RssError, statusCode: number = HTTP_STATUS.BAD_REQUEST): NextResponse {
  return NextResponse.json({ error }, { status: statusCode });
}

/**
 * Validates and parses the request body
 *
 * @param request - Next.js request object
 * @returns Parsed request body or error response
 */
async function parseRequestBody(request: NextRequest): Promise<RssApiRequest | NextResponse> {
  try {
    const body = await request.json();
    return body;
  } catch {
    return createErrorResponse(
      createValidationError('Invalid request body. Expected JSON with "url" field.')
    );
  }
}

/**
 * Validates the URL from the request body
 *
 * @param url - URL string to validate
 * @returns Trimmed URL or error response
 */
function validateUrl(url: unknown): string | NextResponse {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return createErrorResponse(
      createValidationError('Please provide a valid RSS feed URL.')
    );
  }

  const trimmedUrl = url.trim();

  if (!isValidUrl(trimmedUrl)) {
    return createErrorResponse(createInvalidUrlError());
  }

  return trimmedUrl;
}

/**
 * Creates a timeout controller for fetch requests
 *
 * @returns Object containing abort controller and timeout ID
 */
function createFetchTimeout(): { controller: AbortController; timeoutId: NodeJS.Timeout } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return { controller, timeoutId };
}

/**
 * Handles fetch timeout errors
 *
 * @param error - Error object from fetch
 * @returns Error response if timeout, otherwise rethrows
 */
function handleFetchTimeout(error: unknown): NextResponse | never {
  if (error instanceof Error && error.name === 'AbortError') {
    return createErrorResponse(
      createFetchError('Request timeout. The RSS feed took too long to respond.')
    );
  }
  throw error;
}

/**
 * Fetches RSS feed content from a URL
 *
 * @param url - URL to fetch from
 * @returns Response object or error response
 */
async function fetchRssFeed(url: string): Promise<Response | NextResponse> {
  const { controller, timeoutId } = createFetchTimeout();

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': RSS_USER_AGENT,
        'Accept': RSS_ACCEPT_HEADERS,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (fetchError) {
    clearTimeout(timeoutId);
    const timeoutResponse = handleFetchTimeout(fetchError);
    if (timeoutResponse instanceof NextResponse) {
      return timeoutResponse;
    }
    throw fetchError;
  }
}

/**
 * Validates HTTP response status
 *
 * @param response - Fetch response object
 * @returns Error response if status is not OK, otherwise undefined
 */
function validateResponseStatus(response: Response): NextResponse | undefined {
  if (!response.ok) {
    return createErrorResponse(
      createFetchError(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`),
      response.status >= 500 ? HTTP_STATUS.INTERNAL_SERVER_ERROR : HTTP_STATUS.BAD_REQUEST
    );
  }
  return undefined;
}

/**
 * Validates that response content is not empty
 *
 * @param xmlText - XML content string
 * @returns Error response if empty, otherwise undefined
 */
function validateXmlContent(xmlText: string): NextResponse | undefined {
  if (!xmlText || xmlText.trim().length === 0) {
    return createErrorResponse(
      createFetchError('RSS feed returned empty content.')
    );
  }
  return undefined;
}

/**
 * Parses XML content and handles parsing errors
 *
 * @param xmlText - XML content string
 * @returns Success response with parsed data or error response
 */
function parseAndValidateXml(xmlText: string): NextResponse {
  const parseResult = parseRssXmlServer(xmlText);

  if (parseResult.error) {
    return createErrorResponse(parseResult.error);
  }

  const result: { data: ParsedRssData } = {
    data: {
      feed: parseResult.feed,
      rawXml: xmlText,
    },
  };

  return NextResponse.json(result, { status: HTTP_STATUS.OK });
}

/**
 * Creates an error response for unexpected errors
 *
 * @param error - Error object
 * @returns Error response
 */
function createUnexpectedErrorResponse(error: unknown): NextResponse {
  return createErrorResponse(
    createNetworkError(error, 'An unexpected error occurred while fetching the RSS feed.'),
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}

/**
 * Server-side API route to fetch RSS feeds (avoids CORS issues)
 * Handles RSS feed fetching, parsing, and error handling
 *
 * @param request - Next.js request object
 * @returns JSON response with parsed RSS data or error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const bodyResult = await parseRequestBody(request);
    if (bodyResult instanceof NextResponse) {
      return bodyResult;
    }

    // Validate URL
    const urlResult = validateUrl(bodyResult.url);
    if (urlResult instanceof NextResponse) {
      return urlResult;
    }

    // Fetch RSS feed
    const fetchResult = await fetchRssFeed(urlResult);
    if (fetchResult instanceof NextResponse) {
      return fetchResult;
    }

    // Validate response status
    const statusError = validateResponseStatus(fetchResult);
    if (statusError) {
      return statusError;
    }

    // Get and validate XML content
    const xmlText = await fetchResult.text();
    const contentError = validateXmlContent(xmlText);
    if (contentError) {
      return contentError;
    }

    // Parse and return XML
    return parseAndValidateXml(xmlText);
  } catch (error) {
    return createUnexpectedErrorResponse(error);
  }
}

