/**
 * Shared utility functions for parsing RSS field values
 * Handles JSON-encoded fields with attributes and plain text fields
 */

import type { ParsedFieldValue } from '../types/rss';

/**
 * Type guard to check if a value is a parsed field value object
 */
function isParsedFieldValue(value: unknown): value is ParsedFieldValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'text' in value &&
    typeof (value as ParsedFieldValue).text === 'string'
  );
}

/**
 * Parses a field value that might be JSON (for elements with attributes)
 * Returns both text content and attributes if present
 *
 * @param value - Field value that may be JSON string or plain text
 * @returns Parsed field value with text and optional attributes
 */
export function parseFieldValue(value: string | undefined): ParsedFieldValue {
  if (!value || typeof value !== 'string') {
    return { text: '' };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { text: '' };
  }

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (isParsedFieldValue(parsed)) {
        return {
          text: String(parsed.text || ''),
          attributes: parsed.attributes ? { ...parsed.attributes } : undefined,
        };
      }
    } catch {
      // Invalid JSON, treat as plain text
    }
  }

  return { text: trimmed };
}

/**
 * Extracts text content from a field value
 * Handles both JSON with attributes and plain text
 *
 * @param value - Field value that may be JSON or plain text
 * @returns Extracted text content
 */
export function extractTextContent(value: string | undefined): string {
  return parseFieldValue(value).text;
}

/**
 * Extracts link URL from a field value that may be JSON with attributes
 * Prioritizes href attribute, then text content
 *
 * @param value - Field value that may be JSON or plain text
 * @returns Extracted link URL or undefined
 */
export function extractLinkUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const parsed = parseFieldValue(value);
  const href = parsed.attributes?.href;
  if (href && typeof href === 'string' && href.trim()) {
    return href.trim();
  }

  const text = parsed.text?.trim();
  if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
    return text;
  }

  return text || undefined;
}

/**
 * Parses field value for display, prioritizing href for link fields
 *
 * @param value - Field value that may be JSON string or plain text
 * @param fieldName - Optional field name to determine if it's a link field
 * @returns Extracted text content from JSON or original value
 */
export function parseFieldValueForDisplay(
  value: string | undefined,
  fieldName?: string
): string {
  if (!value) return '';

  const parsed = parseFieldValue(value);
  const isLinkField =
    fieldName?.toLowerCase().includes('link') ||
    fieldName?.toLowerCase() === 'link';

  if (isLinkField && parsed.attributes?.href) {
    return parsed.attributes.href;
  }

  return parsed.text;
}

/**
 * Checks if a field value contains JSON with attributes
 *
 * @param value - Field value to check
 * @returns True if value is JSON with attributes object
 */
export function hasAttributes(value: string | undefined): boolean {
  if (!value) return false;

  const parsed = parseFieldValue(value);
  return parsed.attributes !== undefined && Object.keys(parsed.attributes).length > 0;
}

/**
 * Creates a field value string from text and optional attributes
 * Used when updating field values while preserving attributes
 *
 * @param text - Text content
 * @param attributes - Optional attributes object
 * @returns JSON string if attributes exist, plain text otherwise
 */
export function createFieldValue(
  text: string,
  attributes?: Record<string, string>
): string {
  const cleanText = String(text || '').trim();
  const cleanAttrs = attributes && Object.keys(attributes).length > 0
    ? Object.fromEntries(
      Object.entries(attributes).map(([k, v]) => [k, String(v)])
    )
    : undefined;

  if (cleanAttrs) {
    return JSON.stringify({ text: cleanText, attributes: cleanAttrs });
  }
  return cleanText;
}

