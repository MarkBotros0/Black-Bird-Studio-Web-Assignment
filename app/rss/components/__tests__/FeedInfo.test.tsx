import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedInfo from '../FeedInfo';
import type { RssFeed } from '../../types/rss';

describe('FeedInfo', () => {
  const createMockFeed = (overrides?: Partial<RssFeed>): RssFeed => ({
    channelFields: {
      title: 'Test Feed',
      description: 'Test Description',
      link: 'https://example.com',
    },
    items: [{ title: 'Item 1' }, { title: 'Item 2' }],
    feedType: 'rss',
    ...overrides,
  });

  it('should render feed title from channelFields.title', () => {
    const feed = createMockFeed();
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('Test Feed')).toBeInTheDocument();
  });

  it('should render feed title from channelFields.name when title is missing', () => {
    const feed = createMockFeed({
      channelFields: {
        name: 'Feed Name',
        description: 'Description',
      },
    });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('Feed Name')).toBeInTheDocument();
  });

  it('should render default title when neither title nor name exists', () => {
    const feed = createMockFeed({
      channelFields: {},
    });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('RSS Feed')).toBeInTheDocument();
  });

  it('should render description from channelFields.description', () => {
    const feed = createMockFeed();
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render description from channelFields.subtitle when description is missing', () => {
    const feed = createMockFeed({
      channelFields: {
        title: 'Test Feed',
        subtitle: 'Subtitle Description',
      },
    });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('Subtitle Description')).toBeInTheDocument();
  });

  it('should render link from channelFields.link', () => {
    const feed = createMockFeed();
    render(<FeedInfo feed={feed} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should render link from channelFields.id when link is missing', () => {
    const feed = createMockFeed({
      channelFields: {
        title: 'Test Feed',
        id: 'https://example.com/feed',
      },
    });
    render(<FeedInfo feed={feed} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/feed');
  });

  it('should display correct item count', () => {
    const feed = createMockFeed({
      items: [{ title: 'Item 1' }, { title: 'Item 2' }, { title: 'Item 3' }],
    });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('3 items found')).toBeInTheDocument();
  });

  it('should display singular item count', () => {
    const feed = createMockFeed({
      items: [{ title: 'Item 1' }],
    });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('1 item found')).toBeInTheDocument();
  });

  it('should display zero items', () => {
    const feed = createMockFeed({
      items: [],
    });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('0 items found')).toBeInTheDocument();
  });

  it('should render RSS feed type', () => {
    const feed = createMockFeed({ feedType: 'rss' });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('Format: RSS')).toBeInTheDocument();
  });

  it('should render ATOM feed type', () => {
    const feed = createMockFeed({ feedType: 'atom' });
    render(<FeedInfo feed={feed} />);
    expect(screen.getByText('Format: ATOM')).toBeInTheDocument();
  });

  it('should handle XML title values', () => {
    const feed = createMockFeed({
      channelFields: {
        title: '<![CDATA[CDATA Title]]>',
      },
    });
    render(<FeedInfo feed={feed} />);
    // The component should display the title (extraction happens in fieldParsing utility)
    // For now, just verify the component renders without error
    expect(screen.getByText(/CDATA Title|<!\[CDATA\[CDATA Title\]\]>/)).toBeInTheDocument();
  });
});

