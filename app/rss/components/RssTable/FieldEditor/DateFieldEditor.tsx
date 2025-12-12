'use client';

import Input from '../../ui/Input';

/**
 * Props for DateFieldEditor component
 */
interface DateFieldEditorProps {
  /** Current date value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
}

/**
 * Component for editing date field values
 *
 * @param props - Component props
 * @returns Rendered date field editor component
 */
export default function DateFieldEditor({
  value,
  onChange,
}: DateFieldEditorProps) {
  return (
    <Input
      type="text"
      variant="field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

