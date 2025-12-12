'use client';

import { useState } from 'react';
import { EXPANDABLE_FIELD_THRESHOLD } from '../../../constants';
import { styles } from '../../../styles';

/**
 * Props for DefaultField component
 */
interface DefaultFieldProps {
  /** Value to display */
  value: string;
}

/**
 * Component for displaying default field values with expand/collapse for huge fields
 *
 * @param props - Component props
 * @returns Rendered default field component
 */
export default function DefaultField({ value }: DefaultFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayValue = value || '-';
  const isHuge = displayValue.length > EXPANDABLE_FIELD_THRESHOLD;

  if (!isHuge) {
    return (
      <div className={`${styles.text.body} break-words overflow-wrap-anywhere`}>
        {displayValue}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div
        className={`${styles.text.body} break-words overflow-wrap-anywhere ${
          isExpanded ? '' : 'line-clamp-3'
        }`}
        style={
          isExpanded
            ? undefined
            : { WebkitLineClamp: 3 }
        }
      >
        {displayValue}
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${styles.text.link} text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1`}
        aria-label={isExpanded ? 'Collapse text' : 'Expand text'}
      >
        {isExpanded ? '▼ Show less' : '▶ Show more'}
      </button>
    </div>
  );
}

