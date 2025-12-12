'use client';

import { useCallback } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { styles, cn } from '../styles';

/**
 * Example RSS feed definition
 */
export interface ExampleFeed {
    /** Display name of the feed */
    name: string;
    /** RSS feed URL */
    url: string;
}

/**
 * List of example RSS feeds
 */
export const EXAMPLE_FEEDS: ExampleFeed[] = [
    {
        name: 'BBC News – World',
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    },
    {
        name: 'BBC News – Technology',
        url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    },
    {
        name: 'New York Times – Technology',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    },
    {
        name: 'NASA Breaking News',
        url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    },
    {
        name: 'ESPN Top Headlines',
        url: 'https://www.espn.com/espn/rss/news',
    },
    {
        name: 'Hacker News (Unofficial)',
        url: 'https://news.ycombinator.com/rss',
    },
    {
        name: 'The Verge – Tech',
        url: 'https://www.theverge.com/rss/index.xml',
    },
];

/**
 * Props for ExampleFeeds component
 */
interface ExampleFeedsProps {
    /** Whether the fetch operation is in progress */
    loading: boolean;
    /** Callback when an example feed is selected */
    onFeedSelect: (url: string) => void;
}

/**
 * Component displaying example RSS feeds that users can quickly load
 *
 * @param props - Component props
 * @returns Rendered example feeds component
 */
export default function ExampleFeeds({ loading, onFeedSelect }: ExampleFeedsProps) {
    /**
     * Handles clicking on an example feed
     */
    const handleFeedClick = useCallback(
        (feedUrl: string) => {
            if (!loading) {
                onFeedSelect(feedUrl);
            }
        },
        [loading, onFeedSelect]
    );

    return (
        <Card className="mb-6">
            <div className="mb-4">
                <h3 className={cn(styles.text.heading3, 'text-gray-900 dark:text-gray-100')}>
                    Example RSS Feeds
                </h3>
                <p className={cn(styles.text.body, styles.text.muted, 'mt-1')}>
                    Click on any feed below to load it instantly
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {EXAMPLE_FEEDS.map((feed) => (
                    <Button
                        key={feed.url}
                        variant="secondary"
                        size="small"
                        onClick={() => handleFeedClick(feed.url)}
                        disabled={loading}
                        className="text-left justify-start whitespace-normal h-auto py-2 px-3"
                        aria-label={`Load ${feed.name} RSS feed`}
                    >
                        {feed.name}
                    </Button>
                ))}
            </div>
        </Card>
    );
}
