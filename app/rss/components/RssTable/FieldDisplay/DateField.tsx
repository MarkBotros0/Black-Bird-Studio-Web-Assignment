'use client';

import { formatDate } from '../fieldUtils';
import { styles } from '../../../styles';

/**
 * Props for DateField component
 */
interface DateFieldProps {
  /** Date string to format */
  value: string;
}

/**
 * Component for displaying date fields
 *
 * @param props - Component props
 * @returns Rendered date field component
 */
export default function DateField({ value }: DateFieldProps) {
  return <div className={styles.text.body}>{formatDate(value)}</div>;
}

