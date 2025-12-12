import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from '../ErrorDisplay';
import type { RssError } from '../../types/rss';

describe('ErrorDisplay', () => {
  it('should render error message', () => {
    const error: RssError = {
      message: 'Failed to fetch RSS feed',
      type: 'FETCH_ERROR',
    };
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('Failed to fetch RSS feed')).toBeInTheDocument();
  });

  it('should format error type by replacing underscores', () => {
    const error: RssError = {
      message: 'Test error',
      type: 'FETCH_ERROR',
    };
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('FETCH ERROR')).toBeInTheDocument();
  });

  it('should display default message when error message is missing', () => {
    const error: RssError = {
      message: '',
      type: 'PARSE_ERROR',
    };
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
  });

  it('should display default message when error message is undefined', () => {
    const error: RssError = {
      message: undefined as unknown as string,
      type: 'VALIDATION_ERROR',
    };
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
  });

  it('should handle error without type', () => {
    const error: RssError = {
      message: 'Some error',
      type: undefined as unknown as RssError['type'],
    };
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should have role="alert" and aria-live="polite"', () => {
    const error: RssError = {
      message: 'Error message',
      type: 'GENERATION_ERROR',
    };
    render(<ErrorDisplay error={error} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('should render error icon', () => {
    const error: RssError = {
      message: 'Error',
      type: 'INVALID_URL',
    };
    const { container } = render(<ErrorDisplay error={error} />);
    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should return null when error is falsy', () => {
    const { container } = render(<ErrorDisplay error={null as unknown as RssError} />);
    expect(container.firstChild).toBeNull();
  });
});

