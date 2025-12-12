import { describe, it, expect } from 'vitest';
import {
  parseFieldValue,
  extractTextContent,
  extractLinkUrl,
  parseFieldValueForDisplay,
  hasAttributes,
  createFieldValue,
} from '../fieldParsing';

describe('fieldParsing', () => {
  describe('parseFieldValue', () => {
    it('should parse plain text value', () => {
      const result = parseFieldValue('Simple text');
      expect(result).toEqual({ text: 'Simple text' });
    });

    it('should parse JSON value with text and attributes', () => {
      const jsonValue = '{"text":"Link Text","attributes":{"href":"https://example.com"}}';
      const result = parseFieldValue(jsonValue);
      expect(result).toEqual({
        text: 'Link Text',
        attributes: { href: 'https://example.com' },
      });
    });

    it('should handle empty string', () => {
      const result = parseFieldValue('');
      expect(result).toEqual({ text: '' });
    });

    it('should handle undefined', () => {
      const result = parseFieldValue(undefined);
      expect(result).toEqual({ text: '' });
    });

    it('should handle whitespace-only string', () => {
      const result = parseFieldValue('   ');
      expect(result).toEqual({ text: '' });
    });

    it('should handle invalid JSON as plain text', () => {
      const invalidJson = '{invalid json}';
      const result = parseFieldValue(invalidJson);
      expect(result).toEqual({ text: '{invalid json}' });
    });

    it('should handle JSON without attributes', () => {
      const jsonValue = '{"text":"Just text"}';
      const result = parseFieldValue(jsonValue);
      expect(result).toEqual({ text: 'Just text' });
    });

    it('should handle JSON with empty attributes', () => {
      const jsonValue = '{"text":"Text","attributes":{}}';
      const result = parseFieldValue(jsonValue);
      // Empty attributes object is still returned as {} (truthy check)
      expect(result.text).toBe('Text');
      expect(result.attributes).toEqual({});
    });

    it('should trim text content', () => {
      const result = parseFieldValue('  Trimmed text  ');
      expect(result).toEqual({ text: 'Trimmed text' });
    });

    it('should handle JSON with multiple attributes', () => {
      const jsonValue = '{"text":"Content","attributes":{"href":"https://example.com","type":"text/html"}}';
      const result = parseFieldValue(jsonValue);
      expect(result).toEqual({
        text: 'Content',
        attributes: { href: 'https://example.com', type: 'text/html' },
      });
    });

    it('should handle non-object JSON', () => {
      const jsonValue = '["array","value"]';
      const result = parseFieldValue(jsonValue);
      expect(result).toEqual({ text: '["array","value"]' });
    });
  });

  describe('extractTextContent', () => {
    it('should extract text from plain text value', () => {
      const result = extractTextContent('Simple text');
      expect(result).toBe('Simple text');
    });

    it('should extract text from JSON value', () => {
      const jsonValue = '{"text":"JSON Text","attributes":{"href":"https://example.com"}}';
      const result = extractTextContent(jsonValue);
      expect(result).toBe('JSON Text');
    });

    it('should return empty string for undefined', () => {
      const result = extractTextContent(undefined);
      expect(result).toBe('');
    });
  });

  describe('extractLinkUrl', () => {
    it('should extract href from JSON attributes', () => {
      const jsonValue = '{"text":"Link Text","attributes":{"href":"https://example.com"}}';
      const result = extractLinkUrl(jsonValue);
      expect(result).toBe('https://example.com');
    });

    it('should extract URL from plain text if it starts with http://', () => {
      const result = extractLinkUrl('http://example.com');
      expect(result).toBe('http://example.com');
    });

    it('should extract URL from plain text if it starts with https://', () => {
      const result = extractLinkUrl('https://example.com');
      expect(result).toBe('https://example.com');
    });

    it('should return text for non-URL plain text (returns text if not URL)', () => {
      const result = extractLinkUrl('Just text');
      // extractLinkUrl returns text if it's not a URL (per implementation)
      expect(result).toBe('Just text');
    });

    it('should return undefined for empty string', () => {
      const result = extractLinkUrl('');
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const result = extractLinkUrl(undefined);
      expect(result).toBeUndefined();
    });

    it('should prioritize href attribute over text content', () => {
      const jsonValue = '{"text":"https://other.com","attributes":{"href":"https://example.com"}}';
      const result = extractLinkUrl(jsonValue);
      expect(result).toBe('https://example.com');
    });

    it('should trim href attribute', () => {
      const jsonValue = '{"text":"Link","attributes":{"href":"  https://example.com  "}}';
      const result = extractLinkUrl(jsonValue);
      expect(result).toBe('https://example.com');
    });

    it('should handle empty href attribute', () => {
      const jsonValue = '{"text":"https://example.com","attributes":{"href":""}}';
      const result = extractLinkUrl(jsonValue);
      expect(result).toBe('https://example.com');
    });
  });

  describe('parseFieldValueForDisplay', () => {
    it('should return href for link field with attributes', () => {
      const jsonValue = '{"text":"Link Text","attributes":{"href":"https://example.com"}}';
      const result = parseFieldValueForDisplay(jsonValue, 'link');
      expect(result).toBe('https://example.com');
    });

    it('should return text for non-link field with attributes', () => {
      const jsonValue = '{"text":"Content","attributes":{"href":"https://example.com"}}';
      const result = parseFieldValueForDisplay(jsonValue, 'title');
      expect(result).toBe('Content');
    });

    it('should return text for link field without attributes', () => {
      const result = parseFieldValueForDisplay('https://example.com', 'link');
      expect(result).toBe('https://example.com');
    });

    it('should handle undefined field name', () => {
      const jsonValue = '{"text":"Content","attributes":{"href":"https://example.com"}}';
      const result = parseFieldValueForDisplay(jsonValue);
      expect(result).toBe('Content');
    });

    it('should handle case-insensitive link field detection', () => {
      const jsonValue = '{"text":"Link Text","attributes":{"href":"https://example.com"}}';
      expect(parseFieldValueForDisplay(jsonValue, 'LINK')).toBe('https://example.com');
      expect(parseFieldValueForDisplay(jsonValue, 'Link')).toBe('https://example.com');
      expect(parseFieldValueForDisplay(jsonValue, 'permalink')).toBe('https://example.com');
    });

    it('should return empty string for undefined value', () => {
      const result = parseFieldValueForDisplay(undefined);
      expect(result).toBe('');
    });
  });

  describe('hasAttributes', () => {
    it('should return true for JSON with attributes', () => {
      const jsonValue = '{"text":"Content","attributes":{"href":"https://example.com"}}';
      const result = hasAttributes(jsonValue);
      expect(result).toBe(true);
    });

    it('should return false for plain text', () => {
      const result = hasAttributes('Plain text');
      expect(result).toBe(false);
    });

    it('should return false for JSON without attributes', () => {
      const jsonValue = '{"text":"Content"}';
      const result = hasAttributes(jsonValue);
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = hasAttributes('');
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = hasAttributes(undefined);
      expect(result).toBe(false);
    });

    it('should return false for JSON with empty attributes', () => {
      const jsonValue = '{"text":"Content","attributes":{}}';
      const result = hasAttributes(jsonValue);
      expect(result).toBe(false);
    });
  });

  describe('createFieldValue', () => {
    it('should create plain text for text without attributes', () => {
      const result = createFieldValue('Simple text');
      expect(result).toBe('Simple text');
    });

    it('should create JSON string for text with attributes', () => {
      const result = createFieldValue('Link Text', { href: 'https://example.com' });
      const parsed = JSON.parse(result);
      expect(parsed.text).toBe('Link Text');
      expect(parsed.attributes.href).toBe('https://example.com');
    });

    it('should trim text content', () => {
      const result = createFieldValue('  Trimmed  ');
      expect(result).toBe('Trimmed');
    });

    it('should handle empty attributes object', () => {
      const result = createFieldValue('Text', {});
      expect(result).toBe('Text');
    });

    it('should handle undefined attributes', () => {
      const result = createFieldValue('Text', undefined);
      expect(result).toBe('Text');
    });

    it('should convert attribute values to strings', () => {
      const result = createFieldValue('Text', { number: 123, bool: true });
      const parsed = JSON.parse(result);
      expect(parsed.attributes.number).toBe('123');
      expect(parsed.attributes.bool).toBe('true');
    });

    it('should handle empty text with attributes', () => {
      const result = createFieldValue('', { href: 'https://example.com' });
      const parsed = JSON.parse(result);
      expect(parsed.text).toBe('');
      expect(parsed.attributes.href).toBe('https://example.com');
    });

    it('should handle multiple attributes', () => {
      const result = createFieldValue('Content', {
        href: 'https://example.com',
        type: 'text/html',
        rel: 'alternate',
      });
      const parsed = JSON.parse(result);
      expect(parsed.attributes.href).toBe('https://example.com');
      expect(parsed.attributes.type).toBe('text/html');
      expect(parsed.attributes.rel).toBe('alternate');
    });
  });
});

