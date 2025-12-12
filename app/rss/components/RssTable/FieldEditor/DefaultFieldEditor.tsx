'use client';

import Input from '../../ui/Input';

/**
 * Props for DefaultFieldEditor component
 */
interface DefaultFieldEditorProps {
  /** Current field value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
}

/**
 * Component for editing default field values
 *
 * @param props - Component props
 * @returns Rendered default field editor component
 */
export default function DefaultFieldEditor({
  value,
  onChange,
}: DefaultFieldEditorProps) {
  return (
    <Input
      type="text"
      variant="field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

