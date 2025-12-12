'use client';

import Card from './ui/Card';
import Spinner from './ui/Spinner';
import { styles } from '../styles';

/**
 * Props for LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Optional message to display below spinner */
  message?: string;
}

/**
 * Full-page loading spinner component
 * Displays a centered spinner with optional message
 *
 * @param props - Component props
 * @returns Rendered loading spinner component
 */
export default function LoadingSpinner({ message = 'Loading RSS feed...' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card padding="large" className={`${styles.layout.center} flex flex-col items-center`}>
        <Spinner size="large" variant="primary" />
        {message && (
          <p className={`${styles.text.muted} mt-4`}>{message}</p>
        )}
      </Card>
    </div>
  );
}

