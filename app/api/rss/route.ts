import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl } from '../../rss/utils/parseRss';
import { parseRssXmlServer } from '../../rss/utils/parseRssServer';
import type { ParsedRssData, RssError } from '../../rss/types/rss';
import { RSS_USER_AGENT, RSS_ACCEPT_HEADERS, REQUEST_TIMEOUT_MS } from '../../rss/constants';

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
 * Server-side API route to fetch RSS feeds (avoids CORS issues)
 * Handles RSS feed fetching, parsing, and error handling
 *
 * @param request - Next.js request object
 * @returns JSON response with parsed RSS data or error
 */
/**
 * Server-side API route to fetch RSS feeds (avoids CORS issues)
 * Handles RSS feed fetching, parsing, and error handling
 *
 * @param request - Next.js request object
 * @returns JSON response with parsed RSS data or error
 */
export async function POST(request: NextRequest) {
  try {
    let body: RssApiRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: {
            message: 'Invalid request body. Expected JSON with "url" field.',
            type: 'VALIDATION_ERROR',
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { url } = body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        {
          error: {
            message: 'Please provide a valid RSS feed URL.',
            type: 'VALIDATION_ERROR',
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const trimmedUrl = url.trim();

    // Validate URL format
    if (!isValidUrl(trimmedUrl)) {
      return NextResponse.json(
        {
          error: {
            message: 'Please enter a valid HTTP or HTTPS URL.',
            type: 'INVALID_URL',
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Fetch RSS feed server-side (no CORS issues)
    const fetchController = new AbortController();
    const timeoutId = setTimeout(() => fetchController.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(trimmedUrl, {
        headers: {
          'User-Agent': RSS_USER_AGENT,
          'Accept': RSS_ACCEPT_HEADERS,
        },
        signal: fetchController.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          {
            error: {
              message: 'Request timeout. The RSS feed took too long to respond.',
              type: 'FETCH_ERROR',
            },
          },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: {
            message: `Failed to fetch RSS feed: ${response.status} ${response.statusText}`,
            type: 'FETCH_ERROR',
          },
        },
        { status: response.status >= 500 ? HTTP_STATUS.INTERNAL_SERVER_ERROR : HTTP_STATUS.BAD_REQUEST }
      );
    }

    const xmlText = await response.text();

    if (!xmlText || xmlText.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            message: 'RSS feed returned empty content.',
            type: 'FETCH_ERROR',
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Parse XML (server-side)
    const parseResult = parseRssXmlServer(xmlText);

    if (parseResult.error) {
      return NextResponse.json(
        {
          error: parseResult.error,
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const result: { data: ParsedRssData } = {
      data: {
        feed: parseResult.feed,
        rawXml: xmlText,
      },
    };

    return NextResponse.json(result, { status: HTTP_STATUS.OK });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? `Network error: ${error.message}`
              : 'An unexpected error occurred while fetching the RSS feed.',
          type: 'FETCH_ERROR',
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

