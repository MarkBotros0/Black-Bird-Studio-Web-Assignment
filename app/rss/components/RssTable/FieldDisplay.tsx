'use client';

import { useMemo, memo } from 'react';
import {
  parseFieldValue,
  isImageField,
  isDateField,
  isLongTextField,
} from './fieldUtils';
import { extractLinkUrl } from '../../utils/fieldParsing';
import { FIELD_PATTERNS } from '../../constants';
import ImageField from './FieldDisplay/ImageField';
import DateField from './FieldDisplay/DateField';
import LongTextField from './FieldDisplay/LongTextField';
import LinkField from './FieldDisplay/LinkField';
import DefaultField from './FieldDisplay/DefaultField';

/**
 * Props for FieldDisplay component
 */
interface FieldDisplayProps {
  /** Field name */
  field: string;
  /** Field value to display */
  value: string | undefined;
}

/**
 * Component for displaying field values in table cells
 * Handles different field types (images, dates, long text, etc.)
 * Memoized to prevent unnecessary re-renders when props haven't changed
 *
 * @param props - Component props
 * @returns Rendered field display component
 */
function FieldDisplay({ field, value }: FieldDisplayProps) {
  const { displayValue, isImage, isDate, isLongText, isLink, linkUrl } = useMemo(() => {
    const parsedValue = parseFieldValue(value, field);
    const imageField = isImageField(field, value);
    const dateField = isDateField(field);
    const longTextField = isLongTextField(field);
    
    const fieldNameLower = field.toLowerCase();
    const linkByName = FIELD_PATTERNS.LINK.some((pattern) =>
      fieldNameLower.includes(pattern) || fieldNameLower === pattern
    );
    const link = linkByName || (parsedValue.startsWith('http') && !imageField);
    const extractedLinkUrl = link ? extractLinkUrl(value) || parsedValue : undefined;

    return {
      displayValue: parsedValue,
      isImage: imageField,
      isDate: dateField,
      isLongText: longTextField,
      isLink: link,
      linkUrl: extractedLinkUrl,
    };
  }, [field, value]);

  if (isImage && displayValue) {
    return <ImageField src={displayValue} alt={field} />;
  }

  if (isDate) {
    return <DateField value={displayValue} />;
  }

  if (isLink && linkUrl && (linkUrl.startsWith('http://') || linkUrl.startsWith('https://'))) {
    return <LinkField url={linkUrl} />;
  }

  if (isLongText) {
    const text = displayValue.replace(/<[^>]*>/g, '');
    return <LongTextField text={text} />;
  }

  return <DefaultField value={displayValue} />;
}

// Memoize component to prevent re-renders when props haven't changed
export default memo(FieldDisplay);

