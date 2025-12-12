import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedMetadata from '../FeedMetadata';

describe('FeedMetadata', () => {
  it('should render title', () => {
    render(<FeedMetadata title="Test Feed" feedType="rss" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Test Feed');
  });

  it('should render description when provided', () => {
    render(
      <FeedMetadata
        title="Test Feed"
        description="Test description"
        feedType="rss"
      />
    );
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(<FeedMetadata title="Test Feed" feedType="rss" />);
    // Verify description text is not present
    expect(screen.queryByText(/test description/i)).not.toBeInTheDocument();
    // Title should still be present
    expect(screen.getByText('Test Feed')).toBeInTheDocument();
  });

  it('should render link when provided', () => {
    render(
      <FeedMetadata
        title="Test Feed"
        link="https://example.com"
        feedType="rss"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('https://example.com');
  });

  it('should not render link when not provided', () => {
    render(<FeedMetadata title="Test Feed" feedType="rss" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should display RSS format type', () => {
    render(<FeedMetadata title="Test Feed" feedType="rss" />);
    expect(screen.getByText('Format: RSS')).toBeInTheDocument();
  });

  it('should display ATOM format type', () => {
    render(<FeedMetadata title="Test Feed" feedType="atom" />);
    expect(screen.getByText('Format: ATOM')).toBeInTheDocument();
  });

  it('should render all props together', () => {
    render(
      <FeedMetadata
        title="My Feed"
        description="Feed description"
        link="https://example.com/feed"
        feedType="atom"
      />
    );
    expect(screen.getByText('My Feed')).toBeInTheDocument();
    expect(screen.getByText('Feed description')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/feed');
    expect(screen.getByText('Format: ATOM')).toBeInTheDocument();
  });
});

