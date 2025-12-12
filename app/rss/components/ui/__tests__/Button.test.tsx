import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should render children correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when loading prop is true', () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading state with spinner', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Check that spinner is present (it should have aria-label="Loading")
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('should not show loading text when not loading', () => {
    render(<Button>Normal Button</Button>);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('Normal Button')).toBeInTheDocument();
  });

  it('should render with primary variant (default)', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    // Button should not be disabled, so variant classes should be applied
    expect(button).toBeInTheDocument();
  });

  it('should render with success variant', () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render with small size (default)', () => {
    render(<Button size="small">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render with large size', () => {
    render(<Button size="large">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should pass through other HTML attributes', () => {
    render(
      <Button aria-label="Custom label" data-testid="test-button">
        Test
      </Button>
    );
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });

  it('should use white spinner variant for primary button', () => {
    render(<Button variant="primary" loading>Primary Loading</Button>);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('text-white');
  });

  it('should use white spinner variant for success button', () => {
    render(<Button variant="success" loading>Success Loading</Button>);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('text-white');
  });

  it('should use gray spinner variant for secondary button', () => {
    render(<Button variant="secondary" loading>Secondary Loading</Button>);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('text-gray-600');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

