'use client';

import { useCallback } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { styles } from '../styles';

/**
 * Props for RssUrlInput component
 */
interface RssUrlInputProps {
  /** Current URL value */
  url: string;
  /** Whether the fetch operation is in progress */
  loading: boolean;
  /** Callback when URL input changes */
  onUrlChange: (url: string) => void;
  /** Callback to trigger RSS feed fetch */
  onFetch: () => void;
}

/**
 * Input component for entering RSS feed URL
 * Supports Enter key to trigger fetch
 *
 * @param props - Component props
 * @returns Rendered URL input component
 */
export default function RssUrlInput({
  url,
  loading,
  onUrlChange,
  onFetch,
}: RssUrlInputProps) {
  /**
   * Handles Enter key press to trigger fetch
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !loading && url.trim()) {
        e.preventDefault();
        onFetch();
      }
    },
    [loading, url, onFetch]
  );

  return (
    <Card className="mb-6">
      <div className={styles.layout.flex.row}>
        <Input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter RSS feed URL (e.g., https://example.com/feed.xml)"
          className="flex-1"
          disabled={loading}
          aria-label="RSS feed URL"
          aria-describedby="url-input-description"
        />
        <span id="url-input-description" className="sr-only">
          Enter the URL of an RSS or Atom feed to parse and edit
        </span>
        <Button
          variant="primary"
          size="large"
          onClick={onFetch}
          disabled={loading || !url.trim()}
          loading={loading}
          aria-label={loading ? 'Fetching RSS feed' : 'Fetch RSS feed'}
        >
          Fetch RSS
        </Button>
      </div>
    </Card>
  );
}

