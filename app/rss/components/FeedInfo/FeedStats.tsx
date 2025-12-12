'use client';

import { styles } from '../../styles';

/**
 * Props for FeedStats component
 */
interface FeedStatsProps {
  /** Number of items in the feed */
  itemCount: number;
}

/**
 * Component for displaying feed statistics
 *
 * @param props - Component props
 * @returns Rendered feed stats component
 */
export default function FeedStats({ itemCount }: FeedStatsProps) {
  const itemText = itemCount === 1 ? 'item' : 'items';

  return (
    <p
      className={`${styles.text.body} ${styles.text.muted} text-left`}
      aria-live="polite"
    >
      {itemCount} {itemText} found
    </p>
  );
}

