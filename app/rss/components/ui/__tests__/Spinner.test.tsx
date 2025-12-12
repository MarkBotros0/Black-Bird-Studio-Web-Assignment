import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner', () => {
  it('should render with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('should render with small size', () => {
    render(<Spinner size="small" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('should render with medium size (default)', () => {
    render(<Spinner size="medium" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('h-6', 'w-6');
  });

  it('should render with large size', () => {
    render(<Spinner size="large" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('should render with primary variant (default)', () => {
    render(<Spinner variant="primary" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('text-blue-600');
  });

  it('should render with white variant', () => {
    render(<Spinner variant="white" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('text-white');
  });

  it('should render with gray variant', () => {
    render(<Spinner variant="gray" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('text-gray-600');
  });

  it('should apply custom className', () => {
    render(<Spinner className="custom-class" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('custom-class');
  });

  it('should have animate-spin class', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('animate-spin');
  });
});

