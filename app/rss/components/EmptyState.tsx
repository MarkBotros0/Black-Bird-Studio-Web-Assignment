'use client';

import Card from './ui/Card';
import { styles } from '../styles';

/**
 * Component displayed when no RSS feed is loaded
 *
 * @returns Rendered empty state component
 */
export default function EmptyState() {
  return (
    <Card padding="large" className={styles.layout.center}>
      <svg
        className={styles.emptyState.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className={styles.emptyState.title}>No RSS feed loaded</h3>
      <p className={styles.emptyState.description}>
        Enter an RSS feed URL above to get started.
      </p>
    </Card>
  );
}

