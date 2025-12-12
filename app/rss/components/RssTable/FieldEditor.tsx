'use client';

import {
  parseFieldValue,
  isImageField,
  isDateField,
  isLongTextField,
} from './fieldUtils';
import ImageFieldEditor from './FieldEditor/ImageFieldEditor';
import DateFieldEditor from './FieldEditor/DateFieldEditor';
import LongTextFieldEditor from './FieldEditor/LongTextFieldEditor';
import DefaultFieldEditor from './FieldEditor/DefaultFieldEditor';

/**
 * Props for FieldEditor component
 */
interface FieldEditorProps {
  /** Field name */
  field: string;
  /** Current field value */
  value: string | undefined;
  /** Callback when value changes */
  onChange: (value: string) => void;
}

/**
 * Component for editing field values in table cells
 * Provides appropriate input type based on field type
 *
 * @param props - Component props
 * @returns Rendered field editor component
 */
export default function FieldEditor({
  field,
  value,
  onChange,
}: FieldEditorProps) {
  const displayValue = parseFieldValue(value, field);
  const isImage = isImageField(field, value);
  const isDate = isDateField(field);
  const isLongText = isLongTextField(field);

  if (isImage) {
    return (
      <ImageFieldEditor value={displayValue} onChange={onChange} />
    );
  }

  if (isDate) {
    return <DateFieldEditor value={displayValue} onChange={onChange} />;
  }

  if (isLongText) {
    return (
      <LongTextFieldEditor value={displayValue} onChange={onChange} />
    );
  }

  return <DefaultFieldEditor value={displayValue} onChange={onChange} />;
}

