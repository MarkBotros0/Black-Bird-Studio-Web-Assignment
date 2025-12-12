import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import RssUrlInput from '../RssUrlInput';

describe('RssUrlInput', () => {
  const mockOnUrlChange = vi.fn();
  const mockOnFetch = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnUrlChange.mockClear();
    mockOnFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render with initial URL value', () => {
    render(
      <RssUrlInput
        url="https://example.com/feed.xml"
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('https://example.com/feed.xml');
  });

  it('should update local state immediately when typing', () => {
    render(
      <RssUrlInput
        url=""
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });

  it('should debounce onUrlChange callback', () => {
    render(
      <RssUrlInput
        url=""
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox');
    
    act(() => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    expect(mockOnUrlChange).not.toHaveBeenCalled();
    
    // Fast-forward time past debounce delay (URL_INPUT_DEBOUNCE_MS = 500)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // After advancing timers, the debounced callback should have been called
    expect(mockOnUrlChange).toHaveBeenCalledWith('test');
    expect(mockOnUrlChange).toHaveBeenCalledTimes(1);
  });

  it('should sync local state when url prop changes', () => {
    const { rerender } = render(
      <RssUrlInput
        url="initial"
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');

    rerender(
      <RssUrlInput
        url="updated"
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    expect(input.value).toBe('updated');
  });

  it('should call onFetch when Enter key is pressed', () => {
    render(
      <RssUrlInput
        url="https://example.com/feed.xml"
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnFetch).toHaveBeenCalledTimes(1);
  });

  it('should not call onFetch when Enter is pressed with empty URL', () => {
    render(
      <RssUrlInput
        url=""
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnFetch).not.toHaveBeenCalled();
  });

  it('should not call onFetch when Enter is pressed with whitespace-only URL', () => {
    render(
      <RssUrlInput
        url="   "
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnFetch).not.toHaveBeenCalled();
  });

  it('should not call onFetch when Enter is pressed while loading', () => {
    render(
      <RssUrlInput
        url="https://example.com/feed.xml"
        loading={true}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnFetch).not.toHaveBeenCalled();
  });

  it('should update parent URL state before fetching on Enter', () => {
    render(
      <RssUrlInput
        url=""
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new-url' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnUrlChange).toHaveBeenCalledWith('new-url');
    expect(mockOnFetch).toHaveBeenCalledTimes(1);
  });

  it('should call onFetch when button is clicked', () => {
    render(
      <RssUrlInput
        url="https://example.com/feed.xml"
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const button = screen.getByRole('button', { name: /fetch rss/i });
    fireEvent.click(button);
    expect(mockOnFetch).toHaveBeenCalledTimes(1);
  });

  it('should disable input and button when loading', () => {
    render(
      <RssUrlInput
        url="https://example.com/feed.xml"
        loading={true}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should disable button when URL is empty', () => {
    render(
      <RssUrlInput
        url=""
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading state on button when loading', () => {
    render(
      <RssUrlInput
        url="https://example.com/feed.xml"
        loading={true}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should have proper ARIA labels', () => {
    render(
      <RssUrlInput
        url=""
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByLabelText('RSS feed URL');
    expect(input).toBeInTheDocument();
  });

  it('should have placeholder text', () => {
    render(
      <RssUrlInput
        url=""
        loading={false}
        onUrlChange={mockOnUrlChange}
        onFetch={mockOnFetch}
      />
    );
    const input = screen.getByPlaceholderText(/enter rss feed url/i);
    expect(input).toBeInTheDocument();
  });
});

