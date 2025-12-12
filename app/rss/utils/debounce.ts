/**
 * Utility functions for debouncing function calls
 */

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last invocation.
 *
 * @param func - Function to debounce
 * @param wait - Number of milliseconds to delay
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query) => {
 *   performSearch(query);
 * }, 300);
 *
 * // Only executes after 300ms of inactivity
 * debouncedSearch('test');
 * debouncedSearch('test query'); // Previous call cancelled
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic function constraint requires any for maximum flexibility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  return function debounced(...args: Parameters<T>) {
    const later = () => {
      timeoutId = undefined;
      func(...args);
    };

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);
  };
}

/**
 * Creates a debounced function that also provides a cancel method
 * to cancel pending invocations.
 *
 * @param func - Function to debounce
 * @param wait - Number of milliseconds to delay
 * @returns Object with debounced function and cancel method
 *
 * @example
 * ```typescript
 * const { debounced, cancel } = debounceWithCancel((value) => {
 *   console.log(value);
 * }, 300);
 *
 * debounced('test');
 * cancel(); // Cancels pending invocation
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic function constraint requires any for maximum flexibility
export function debounceWithCancel<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): {
  debounced: (...args: Parameters<T>) => void;
  cancel: () => void;
} {
  let timeoutId: NodeJS.Timeout | undefined;

  const debounced = (...args: Parameters<T>) => {
    const later = () => {
      timeoutId = undefined;
      func(...args);
    };

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);
  };

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return { debounced, cancel };
}

