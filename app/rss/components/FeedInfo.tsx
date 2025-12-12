'use client';

import type { RssFeed } from '../types/rss';
import Card from './ui/Card';
import FeedMetadata from './FeedInfo/FeedMetadata';
import FeedStats from './FeedInfo/FeedStats';
import { extractLinkUrl, extractTextContent } from '../utils/fieldParsing';

/**
 * Props for FeedInfo component
 */
interface FeedInfoProps {
  /** RSS feed data to display */
  feed: RssFeed;
}

/**
 * Component for displaying RSS feed metadata and information
 *
 * @param props - Component props
 * @returns Rendered feed info component
 */
export default function FeedInfo({ feed }: FeedInfoProps) {
  const titleValue = feed.channelFields.title || feed.channelFields.name;
  const title = titleValue ? extractTextContent(titleValue) : 'RSS Feed';

  const descriptionValue =
    feed.channelFields.description || feed.channelFields.subtitle;
  const description = descriptionValue
    ? extractTextContent(descriptionValue)
    : undefined;

  const linkValue = feed.channelFields.link || feed.channelFields.id;
  const link = linkValue ? extractLinkUrl(linkValue) : undefined;

  const itemCount = feed.items.length;

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <FeedMetadata
          title={title}
          description={description}
          link={link}
          feedType={feed.feedType}
        />
      </div>
      <FeedStats itemCount={itemCount} />
    </Card>
  );
}

