'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook that debounces a value
 * Returns the debounced value that only updates after the specified delay
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 *
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook that debounces a callback function
 * Returns a debounced version of the callback that only executes after the delay
 *
 * @param callback - Callback function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced callback function
 *
 * @example
 * ```typescript
 * const handleUrlChange = useDebouncedCallback((url: string) => {
 *   validateUrl(url);
 * }, 500);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic function constraint requires any for maximum flexibility
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

