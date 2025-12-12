import { parseFieldValueForDisplay } from '../../utils/fieldParsing';
import { FIELD_PATTERNS } from '../../constants';

/**
 * Parses a field value that might be JSON (for elements with attributes)
 * For link fields, prioritizes href attribute over text content
 *
 * @param value - Field value that may be JSON string or plain text
 * @param fieldName - Optional field name to determine if it's a link field
 * @returns Extracted text content from JSON or original value
 */
export function parseFieldValue(
  value: string | undefined,
  fieldName?: string
): string {
  return parseFieldValueForDisplay(value, fieldName);
}

/**
 * Checks if a field is an image field based on field name or value
 *
 * @param fieldName - Name of the field
 * @param value - Field value to check
 * @returns True if field appears to be an image field
 */
export function isImageField(
  fieldName: string,
  value: string | undefined
): boolean {
  if (!value || typeof value !== 'string' || !fieldName) {
    return false;
  }
  
  const fieldNameLower = fieldName.toLowerCase();
  const isImageByName = FIELD_PATTERNS.IMAGE.some((pattern) =>
    fieldNameLower.includes(pattern)
  );
  
  if (isImageByName) return true;
  
  const parsed = parseFieldValue(value);
  if (!parsed || typeof parsed !== 'string') {
    return false;
  }
  
  return parsed.startsWith('http') && /\.(jpg|jpeg|png|gif|webp|svg)/i.test(parsed);
}

/**
 * Formats a date string to a readable format
 *
 * @param dateString - Date string to format
 * @returns Formatted date string or original if invalid
 */
export function formatDate(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') {
    return dateString || '';
  }

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Checks if a field is a date/time field based on field name
 *
 * @param fieldName - Name of the field
 * @returns True if field name suggests it's a date/time field
 */
export function isDateField(fieldName: string): boolean {
  if (!fieldName || typeof fieldName !== 'string') {
    return false;
  }
  const fieldNameLower = fieldName.toLowerCase();
  return FIELD_PATTERNS.DATE.some((pattern) => fieldNameLower.includes(pattern));
}

/**
 * Checks if a field is a long text field based on field name
 *
 * @param fieldName - Name of the field
 * @returns True if field name suggests it's a long text field
 */
export function isLongTextField(fieldName: string): boolean {
  if (!fieldName || typeof fieldName !== 'string') {
    return false;
  }
  const fieldNameLower = fieldName.toLowerCase();
  return FIELD_PATTERNS.LONG_TEXT.some((pattern) => fieldNameLower.includes(pattern));
}

