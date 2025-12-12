'use client';

import { styles } from '../../../styles';

/**
 * Props for LongTextFieldEditor component
 */
interface LongTextFieldEditorProps {
  /** Current text value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
}

/**
 * Component for editing long text field values
 *
 * @param props - Component props
 * @returns Rendered long text field editor component
 */
export default function LongTextFieldEditor({
  value,
  onChange,
}: LongTextFieldEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className={`${styles.input.field} resize-y`}
    />
  );
}

