'use client';

import { styles } from '../../styles';

/**
 * Props for EmptyTableState component
 */
interface EmptyTableStateProps {
  /** Message to display */
  message: string;
}

/**
 * Component for displaying empty table state
 *
 * @param props - Component props
 * @returns Rendered empty table state component
 */
export default function EmptyTableState({ message }: EmptyTableStateProps) {
  return (
    <div className={`${styles.layout.center} py-12 ${styles.text.muted}`}>
      <p>{message}</p>
    </div>
  );
}

