import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExampleFeeds, { EXAMPLE_FEEDS } from '../ExampleFeeds';

describe('ExampleFeeds', () => {
  const mockOnFeedSelect = vi.fn();

  beforeEach(() => {
    mockOnFeedSelect.mockClear();
  });

  it('should render all example feeds', () => {
    render(
      <ExampleFeeds loading={false} onFeedSelect={mockOnFeedSelect} />
    );
    EXAMPLE_FEEDS.forEach((feed) => {
      expect(screen.getByText(feed.name)).toBeInTheDocument();
    });
  });

  it('should render heading and description', () => {
    render(
      <ExampleFeeds loading={false} onFeedSelect={mockOnFeedSelect} />
    );
    expect(screen.getByText('Example RSS Feeds')).toBeInTheDocument();
    expect(screen.getByText(/click on any feed below to load it instantly/i)).toBeInTheDocument();
  });

  it('should call onFeedSelect when a feed is clicked', () => {
    render(
      <ExampleFeeds loading={false} onFeedSelect={mockOnFeedSelect} />
    );
    const firstFeed = EXAMPLE_FEEDS[0];
    const button = screen.getByRole('button', { name: new RegExp(`load ${firstFeed.name}`, 'i') });
    fireEvent.click(button);
    expect(mockOnFeedSelect).toHaveBeenCalledWith(firstFeed.url);
    expect(mockOnFeedSelect).toHaveBeenCalledTimes(1);
  });

  it('should not call onFeedSelect when loading', () => {
    render(
      <ExampleFeeds loading={true} onFeedSelect={mockOnFeedSelect} />
    );
    const firstFeed = EXAMPLE_FEEDS[0];
    const button = screen.getByRole('button', { name: new RegExp(`load ${firstFeed.name}`, 'i') });
    fireEvent.click(button);
    expect(mockOnFeedSelect).not.toHaveBeenCalled();
  });

  it('should disable all buttons when loading', () => {
    render(
      <ExampleFeeds loading={true} onFeedSelect={mockOnFeedSelect} />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should enable all buttons when not loading', () => {
    render(
      <ExampleFeeds loading={false} onFeedSelect={mockOnFeedSelect} />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should have proper ARIA labels for each feed', () => {
    render(
      <ExampleFeeds loading={false} onFeedSelect={mockOnFeedSelect} />
    );
    EXAMPLE_FEEDS.forEach((feed) => {
      // Escape special regex characters in feed name
      const escapedName = feed.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const button = screen.getByRole('button', {
        name: new RegExp(`load ${escapedName}`, 'i'),
      });
      expect(button).toBeInTheDocument();
    });
  });

  it('should call onFeedSelect with correct URL for each feed', () => {
    render(
      <ExampleFeeds loading={false} onFeedSelect={mockOnFeedSelect} />
    );
    
    EXAMPLE_FEEDS.forEach((feed) => {
      // Escape special regex characters in feed name
      const escapedName = feed.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const button = screen.getByRole('button', {
        name: new RegExp(`load ${escapedName}`, 'i'),
      });
      fireEvent.click(button);
      expect(mockOnFeedSelect).toHaveBeenCalledWith(feed.url);
    });
    
    expect(mockOnFeedSelect).toHaveBeenCalledTimes(EXAMPLE_FEEDS.length);
  });
});

