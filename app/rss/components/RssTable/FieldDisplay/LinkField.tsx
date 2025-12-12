'use client';

import { styles } from '../../../styles';

/**
 * Props for LinkField component
 */
interface LinkFieldProps {
  /** Link URL */
  url: string;
}

/**
 * Component for displaying link fields
 *
 * @param props - Component props
 * @returns Rendered link field component
 */
export default function LinkField({ url }: LinkFieldProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.text.link} ${styles.text.body} break-all`}
      title={url}
    >
      {url}
    </a>
  );
}

