'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { styles } from '../styles';
import { useDebouncedCallback } from '../hooks/useDebounce';
import { URL_INPUT_DEBOUNCE_MS } from '../constants';

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
 * Supports Enter key to trigger fetch and debounced URL updates
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
  // Local state for immediate input updates (keeps input responsive)
  const [localUrl, setLocalUrl] = useState(url);

  // Sync local state when prop changes (e.g., when cleared externally)
  useEffect(() => {
    setLocalUrl(url);
  }, [url]);

  // Debounced callback to update parent state after user stops typing
  const debouncedOnUrlChange = useDebouncedCallback(
    (newUrl: string) => {
      onUrlChange(newUrl);
    },
    URL_INPUT_DEBOUNCE_MS
  );

  /**
   * Handles input change with immediate local update and debounced parent update
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setLocalUrl(newUrl); // Update immediately for responsive UI
      debouncedOnUrlChange(newUrl); // Debounce parent update
    },
    [debouncedOnUrlChange]
  );

  /**
   * Handles Enter key press to trigger fetch
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !loading && localUrl.trim()) {
        e.preventDefault();
        // Ensure parent state is updated before fetching
        onUrlChange(localUrl);
        onFetch();
      }
    },
    [loading, localUrl, onUrlChange, onFetch]
  );

  return (
    <Card className="mb-6">
      <div className={styles.layout.flex.row}>
        <Input
          type="url"
          value={localUrl}
          onChange={handleChange}
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
          disabled={loading || !localUrl.trim()}
          loading={loading}
          aria-label={loading ? 'Fetching RSS feed' : 'Fetch RSS feed'}
        >
          Fetch RSS
        </Button>
      </div>
    </Card>
  );
}

