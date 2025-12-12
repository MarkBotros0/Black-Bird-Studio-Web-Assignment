import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  it('should render the main heading', () => {
    render(<PageHeader />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('RSS Feed Parser & Editor');
  });

  it('should render the description paragraph', () => {
    render(<PageHeader />);
    const description = screen.getByText(
      /Parse, view, and edit RSS and Atom feeds/i
    );
    expect(description).toBeInTheDocument();
    expect(description.textContent).toContain(
      'Enter a feed URL to get started, then customize and export your feed as XML.'
    );
  });

  it('should render as a header element', () => {
    render(<PageHeader />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});

