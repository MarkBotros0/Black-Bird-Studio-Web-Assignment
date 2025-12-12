import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedStats from '../FeedStats';

describe('FeedStats', () => {
  it('should display singular "item" for count of 1', () => {
    render(<FeedStats itemCount={1} />);
    expect(screen.getByText('1 item found')).toBeInTheDocument();
  });

  it('should display plural "items" for count of 0', () => {
    render(<FeedStats itemCount={0} />);
    expect(screen.getByText('0 items found')).toBeInTheDocument();
  });

  it('should display plural "items" for count greater than 1', () => {
    render(<FeedStats itemCount={5} />);
    expect(screen.getByText('5 items found')).toBeInTheDocument();
  });

  it('should display plural "items" for count of 2', () => {
    render(<FeedStats itemCount={2} />);
    expect(screen.getByText('2 items found')).toBeInTheDocument();
  });

  it('should have aria-live="polite" for accessibility', () => {
    render(<FeedStats itemCount={10} />);
    const stats = screen.getByText('10 items found');
    expect(stats).toHaveAttribute('aria-live', 'polite');
  });

  it('should handle large numbers', () => {
    render(<FeedStats itemCount={1000} />);
    expect(screen.getByText('1000 items found')).toBeInTheDocument();
  });
});

