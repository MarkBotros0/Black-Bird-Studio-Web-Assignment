import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyTableState from '../EmptyTableState';

describe('EmptyTableState', () => {
  it('should render the message', () => {
    render(<EmptyTableState message="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(
      <EmptyTableState message="Custom empty state message" />
    );
    expect(
      screen.getByText('Custom empty state message')
    ).toBeInTheDocument();
  });
});

