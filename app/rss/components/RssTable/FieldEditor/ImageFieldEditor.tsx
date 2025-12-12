'use client';

import Input from '../../ui/Input';

/**
 * Props for ImageFieldEditor component
 */
interface ImageFieldEditorProps {
  /** Current image URL value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
}

/**
 * Component for editing image field values
 *
 * @param props - Component props
 * @returns Rendered image field editor component
 */
export default function ImageFieldEditor({
  value,
  onChange,
}: ImageFieldEditorProps) {
  return (
    <Input
      type="text"
      variant="field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Image URL"
    />
  );
}

