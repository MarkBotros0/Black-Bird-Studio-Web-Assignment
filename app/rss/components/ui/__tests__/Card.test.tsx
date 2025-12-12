import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  it('should render children correctly', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render with normal padding (default)', () => {
    render(
      <Card>
        <div>Content</div>
      </Card>
    );
    const card = screen.getByText('Content').parentElement;
    expect(card).toBeInTheDocument();
  });

  it('should render with large padding', () => {
    render(
      <Card padding="large">
        <div>Content</div>
      </Card>
    );
    const card = screen.getByText('Content').parentElement;
    expect(card).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );
    const card = screen.getByText('Content').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('should render multiple children', () => {
    render(
      <Card>
        <div>First</div>
        <div>Second</div>
      </Card>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});

