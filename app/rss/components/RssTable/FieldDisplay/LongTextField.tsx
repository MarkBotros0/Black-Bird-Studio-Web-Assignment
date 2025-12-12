'use client';

import { useState } from 'react';
import { LONG_TEXT_LINE_CLAMP, EXPANDABLE_FIELD_THRESHOLD } from '../../../constants';
import { styles } from '../../../styles';

/**
 * Props for LongTextField component
 */
interface LongTextFieldProps {
  /** Text content to display */
  text: string;
}

/**
 * Component for displaying long text fields with truncation and expand/collapse
 *
 * @param props - Component props
 * @returns Rendered long text field component
 */
export default function LongTextField({ text }: LongTextFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isHuge = text.length > EXPANDABLE_FIELD_THRESHOLD;

  if (!isHuge) {
    return (
      <div
        className={`${styles.text.body} line-clamp-3 break-words`}
        title={text}
        style={{ WebkitLineClamp: LONG_TEXT_LINE_CLAMP }}
      >
        {text}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div
        className={`${styles.text.body} break-words ${
          isExpanded ? '' : 'line-clamp-3'
        }`}
        style={
          isExpanded
            ? undefined
            : { WebkitLineClamp: LONG_TEXT_LINE_CLAMP }
        }
      >
        {text}
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

