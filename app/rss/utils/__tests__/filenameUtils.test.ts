import { describe, it, expect } from 'vitest';
import { sanitizeFilename, generateXmlFilename } from '../filenameUtils';
import { MAX_FILENAME_LENGTH } from '../../constants';

describe('filenameUtils', () => {
  describe('sanitizeFilename', () => {
    it('should sanitize normal filename', () => {
      const result = sanitizeFilename('My Feed Title');
      expect(result).toBe('my_feed_title');
    });

    it('should remove special characters', () => {
      const result = sanitizeFilename('Feed@#$%Title!');
      // All non-alphanumeric chars become underscores
      expect(result).toBe('feed____title_');
    });

    it('should convert to lowercase', () => {
      const result = sanitizeFilename('UPPERCASE TITLE');
      expect(result).toBe('uppercase_title');
    });

    it('should replace spaces and special chars with underscores', () => {
      const result = sanitizeFilename('My Feed-Title (2024)');
      // All non-alphanumeric chars become underscores
      expect(result).toBe('my_feed_title__2024_');
    });

    it('should limit length to MAX_FILENAME_LENGTH', () => {
      const longName = 'a'.repeat(MAX_FILENAME_LENGTH + 50);
      const result = sanitizeFilename(longName);
      expect(result.length).toBeLessThanOrEqual(MAX_FILENAME_LENGTH);
    });

    it('should return "feed" for empty string', () => {
      const result = sanitizeFilename('');
      expect(result).toBe('feed');
    });

    it('should return "feed" for undefined', () => {
      const result = sanitizeFilename(undefined as any);
      expect(result).toBe('feed');
    });

    it('should return "feed" for null', () => {
      const result = sanitizeFilename(null as any);
      expect(result).toBe('feed');
    });

    it('should return "feed" for non-string input', () => {
      const result = sanitizeFilename(123 as any);
      expect(result).toBe('feed');
    });

    it('should handle only special characters', () => {
      const result = sanitizeFilename('@#$%!');
      // All special chars become underscores, result is non-empty so not 'feed'
      expect(result).toBe('_____');
    });

    it('should preserve alphanumeric characters', () => {
      const result = sanitizeFilename('Feed123Title456');
      expect(result).toBe('feed123title456');
    });

    it('should handle unicode characters', () => {
      const result = sanitizeFilename('Feed中文标题');
      // Unicode chars become underscores, 'Feed' becomes 'feed'
      expect(result).toBe('feed____');
    });

    it('should handle very short names', () => {
      const result = sanitizeFilename('A');
      expect(result).toBe('a');
    });
  });

  describe('generateXmlFilename', () => {
    it('should generate filename with .xml extension', () => {
      const result = generateXmlFilename('My Feed');
      expect(result).toBe('my_feed.xml');
    });

    it('should sanitize the title', () => {
      const result = generateXmlFilename('My Feed@Title!');
      // All non-alphanumeric chars become underscores
      expect(result).toBe('my_feed_title_.xml');
    });

    it('should use fallback for empty title', () => {
      const result = generateXmlFilename('');
      expect(result).toBe('feed.xml');
    });

    it('should use fallback for undefined title', () => {
      const result = generateXmlFilename(undefined);
      expect(result).toBe('feed.xml');
    });

    it('should use custom fallback', () => {
      const result = generateXmlFilename('', 'custom');
      expect(result).toBe('custom.xml');
    });

    it('should handle long titles', () => {
      const longTitle = 'a'.repeat(200);
      const result = generateXmlFilename(longTitle);
      expect(result).toMatch(/\.xml$/);
      expect(result.length).toBeLessThanOrEqual(MAX_FILENAME_LENGTH + 4); // +4 for .xml
    });

    it('should handle special characters in title', () => {
      const result = generateXmlFilename('Feed (2024) - Special!');
      // All non-alphanumeric chars become underscores
      expect(result).toBe('feed__2024____special_.xml');
    });

    it('should handle numeric titles', () => {
      const result = generateXmlFilename('123456');
      expect(result).toBe('123456.xml');
    });

    it('should handle titles with only special characters', () => {
      const result = generateXmlFilename('@#$%');
      // All special chars become underscores, result is non-empty
      expect(result).toBe('____.xml');
    });
  });
});

