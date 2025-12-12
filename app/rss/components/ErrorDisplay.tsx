'use client';

import type { RssError } from '../types/rss';
import { styles } from '../styles';

/**
 * Props for ErrorDisplay component
 */
interface ErrorDisplayProps {
  /** Error object to display */
  error: RssError;
}

/**
 * Component for displaying RSS feed errors
 *
 * @param props - Component props
 * @returns Rendered error display component
 */
export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  /**
   * Formats error type for display
   */
  const formattedErrorType = error.type?.replace(/_/g, ' ') || 'Error';

  return (
    <div className={styles.error.container} role="alert" aria-live="polite">
      <div className={styles.layout.flex.start}>
        <div className="flex-shrink-0">
          <svg
            className={styles.error.icon}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className={styles.error.title}>{formattedErrorType}</h3>
          <p className={styles.error.message}>{error.message || 'An unknown error occurred'}</p>
        </div>
      </div>
    </div>
  );
}

