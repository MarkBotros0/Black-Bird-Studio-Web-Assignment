/**
 * Centralized field type detection utilities
 * Used for determining field types based on field names
 */

import { FIELD_PATTERNS } from '../constants';

/**
 * Gets the normalized lowercase field name for pattern matching
 */
function getNormalizedFieldName(fieldName: string): string {
  return fieldName.toLowerCase();
}

/**
 * Checks if a field name matches any of the given patterns
 */
function matchesPatterns(fieldName: string, patterns: readonly string[]): boolean {
  const normalized = getNormalizedFieldName(fieldName);
  return patterns.some((pattern) => normalized.includes(pattern));
}

/**
 * Checks if a field is a title/name field
 */
export function isTitleField(fieldName: string): boolean {
  return matchesPatterns(fieldName, ['title', 'name']);
}

/**
 * Checks if a field is a description/content field
 */
export function isDescriptionField(fieldName: string): boolean {
  return matchesPatterns(fieldName, FIELD_PATTERNS.LONG_TEXT);
}

/**
 * Checks if a field is a long text field (alias for description field)
 */
export function isLongTextField(fieldName: string): boolean {
  return isDescriptionField(fieldName);
}

/**
 * Checks if a field is a date/time field
 */
export function isDateField(fieldName: string): boolean {
  return matchesPatterns(fieldName, FIELD_PATTERNS.DATE);
}

/**
 * Checks if a field is a link/URL field
 */
export function isLinkField(fieldName: string): boolean {
  return matchesPatterns(fieldName, FIELD_PATTERNS.LINK) || 
         matchesPatterns(fieldName, ['url', 'guid']);
}

/**
 * Checks if a field is an image/media field
 */
export function isImageField(fieldName: string): boolean {
  return matchesPatterns(fieldName, FIELD_PATTERNS.IMAGE) ||
         matchesPatterns(fieldName, ['thumbnail', 'media']);
}

/**
 * Checks if a field is an author/creator field
 */
export function isAuthorField(fieldName: string): boolean {
  return matchesPatterns(fieldName, ['author', 'creator']);
}

/**
 * Checks if a field is a category/tag field
 */
export function isCategoryField(fieldName: string): boolean {
  return matchesPatterns(fieldName, ['category', 'tag']);
}

/**
 * Gets the field type category for a field name
 */
export type FieldTypeCategory = 
  | 'title'
  | 'description'
  | 'date'
  | 'link'
  | 'image'
  | 'author'
  | 'category'
  | 'default';

/**
 * Determines the field type category for a given field name
 */
export function getFieldTypeCategory(fieldName: string): FieldTypeCategory {
  if (isTitleField(fieldName)) return 'title';
  if (isDescriptionField(fieldName)) return 'description';
  if (isDateField(fieldName)) return 'date';
  if (isLinkField(fieldName)) return 'link';
  if (isImageField(fieldName)) return 'image';
  if (isAuthorField(fieldName)) return 'author';
  if (isCategoryField(fieldName)) return 'category';
  return 'default';
}

