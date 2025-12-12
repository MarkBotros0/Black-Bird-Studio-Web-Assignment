import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '../useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('useDebounce', () => {
        it('should return initial value immediately', () => {
            const { result } = renderHook(() => useDebounce('initial', 300));
            expect(result.current).toBe('initial');
        });

        it('should debounce value changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'initial', delay: 300 },
                }
            );

            expect(result.current).toBe('initial');

            // Change value
            act(() => {
                rerender({ value: 'updated', delay: 300 });
            });
            expect(result.current).toBe('initial'); // Should still be initial

            // Fast-forward time by 299ms
            act(() => {
                vi.advanceTimersByTime(299);
            });
            expect(result.current).toBe('initial'); // Should still be initial

            // Fast-forward time by 1ms more (total 300ms)
            act(() => {
                vi.advanceTimersByTime(1);
            });
            expect(result.current).toBe('updated'); // Should now be updated
        });

        it('should cancel previous debounce when value changes quickly', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'first', delay: 300 },
                }
            );

            expect(result.current).toBe('first');

            // Change value multiple times quickly
            act(() => {
                rerender({ value: 'second', delay: 300 });
            });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            act(() => {
                rerender({ value: 'third', delay: 300 });
            });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            act(() => {
                rerender({ value: 'fourth', delay: 300 });
            });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            // Should still be first (none of the changes have completed)
            expect(result.current).toBe('first');

            // Advance remaining time
            act(() => {
                vi.advanceTimersByTime(200);
            });
            expect(result.current).toBe('fourth'); // Should be the last value
        });

        it('should handle delay changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'test', delay: 300 },
                }
            );

            expect(result.current).toBe('test');

            act(() => {
                rerender({ value: 'updated', delay: 500 });
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(result.current).toBe('test'); // Should still be old value

            act(() => {
                vi.advanceTimersByTime(200);
            });
            expect(result.current).toBe('updated'); // Should now be updated
        });

        it('should handle number values', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 0, delay: 300 },
                }
            );

            expect(result.current).toBe(0);

            act(() => {
                rerender({ value: 42, delay: 300 });
            });
            expect(result.current).toBe(0); // Should still be 0

            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(result.current).toBe(42);
        });

        it('should handle object values', () => {
            const initialObj = { name: 'initial' };
            const updatedObj = { name: 'updated' };

            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: initialObj, delay: 300 },
                }
            );

            expect(result.current).toBe(initialObj);

            act(() => {
                rerender({ value: updatedObj, delay: 300 });
            });
            expect(result.current).toBe(initialObj); // Should still be initial

            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(result.current).toBe(updatedObj);
        });
    });

    describe('useDebouncedCallback', () => {
        it('should debounce callback execution', () => {
            const callback = vi.fn();
            const { result } = renderHook(() =>
                useDebouncedCallback(callback, 300)
            );

            const debouncedCallback = result.current;

            // Call multiple times quickly
            act(() => {
                debouncedCallback('arg1');
                debouncedCallback('arg2');
                debouncedCallback('arg3');
            });

            expect(callback).not.toHaveBeenCalled();

            // Advance time
            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('arg3'); // Should be called with last argument
        });

        it('should cancel previous callback when called again', () => {
            const callback = vi.fn();
            const { result } = renderHook(() =>
                useDebouncedCallback(callback, 300)
            );

            const debouncedCallback = result.current;

            act(() => {
                debouncedCallback('first');
                vi.advanceTimersByTime(200);
                debouncedCallback('second');
                vi.advanceTimersByTime(200);
                debouncedCallback('third');
            });

            expect(callback).not.toHaveBeenCalled();

            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('third');
        });

        it('should pass multiple arguments to callback', () => {
            const callback = vi.fn();
            const { result } = renderHook(() =>
                useDebouncedCallback(callback, 300)
            );

            const debouncedCallback = result.current;

            act(() => {
                debouncedCallback('arg1', 'arg2', 'arg3');
                vi.advanceTimersByTime(300);
            });

            expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
        });

        it('should handle callback with different argument types', () => {
            const callback = vi.fn();
            const { result } = renderHook(() =>
                useDebouncedCallback(callback, 300)
            );

            const debouncedCallback = result.current;

            act(() => {
                debouncedCallback(42, { key: 'value' }, true);
                vi.advanceTimersByTime(300);
            });

            expect(callback).toHaveBeenCalledWith(42, { key: 'value' }, true);
        });

        it('should cleanup timeout on unmount', () => {
            const callback = vi.fn();
            const { result, unmount } = renderHook(() =>
                useDebouncedCallback(callback, 300)
            );

            const debouncedCallback = result.current;
            act(() => {
                debouncedCallback('test');
            });

            unmount();

            // Advance time - callback should not be called after unmount
            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(callback).not.toHaveBeenCalled();
        });

        it('should handle rapid successive calls', () => {
            const callback = vi.fn();
            const { result } = renderHook(() =>
                useDebouncedCallback(callback, 300)
            );

            const debouncedCallback = result.current;

            // Call 10 times rapidly
            act(() => {
                for (let i = 0; i < 10; i++) {
                    debouncedCallback(`call-${i}`);
                    vi.advanceTimersByTime(50);
                }
            });

            expect(callback).not.toHaveBeenCalled();

            // Advance remaining time
            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('call-9');
        });
    });
});

