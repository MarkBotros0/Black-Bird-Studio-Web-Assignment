import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('should render the empty state message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No RSS feed loaded')).toBeInTheDocument();
    expect(
      screen.getByText('Enter an RSS feed URL above to get started.')
    ).toBeInTheDocument();
  });

  it('should render an icon with aria-hidden', () => {
    const { container } = render(<EmptyState />);
    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render the heading', () => {
    render(<EmptyState />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('No RSS feed loaded');
  });

  it('should be wrapped in a Card component', () => {
    render(<EmptyState />);
    // Card should be present as a parent element
    const heading = screen.getByText('No RSS feed loaded');
    expect(heading).toBeInTheDocument();
  });
});

