'use client';

import { styles } from '../../styles';

/**
 * Props for FeedMetadata component
 */
interface FeedMetadataProps {
  /** Feed title */
  title: string;
  /** Feed description */
  description?: string;
  /** Feed link */
  link?: string;
  /** Feed format type */
  feedType: 'rss' | 'atom';
}

/**
 * Component for displaying feed metadata (title, description, link, format)
 *
 * @param props - Component props
 * @returns Rendered feed metadata component
 */
export default function FeedMetadata({
  title,
  description,
  link,
  feedType,
}: FeedMetadataProps) {
  return (
    <div>
      <div className="text-center">
        <h2 className={styles.text.heading2}>{title}</h2>
        {description && (
          <p className={`${styles.text.muted} mb-2`}>{description}</p>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.text.link} ${styles.text.body} block`}
          >
            {link}
          </a>
        )}
      </div>
      <p className={`text-xs ${styles.text.muted} mt-2 text-left`}>
        Format: {feedType.toUpperCase()}
      </p>
    </div>
  );
}

