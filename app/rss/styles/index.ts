/**
 * Centralized styling constants and utility functions
 * Provides consistent styling across RSS components
 */

/**
 * Common component class names
 */
export const styles = {
  // Card/Container styles
  card: 'bg-white dark:bg-gray-800 rounded-lg shadow-md',
  cardPadding: 'p-6',
  cardPaddingLarge: 'p-12',

  // Button styles
  button: {
    base: 'px-3 py-1 rounded text-sm font-medium transition-colors',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    disabled: 'bg-gray-400 cursor-not-allowed',
    large: 'px-6 py-2 rounded-lg',
  },

  // Input styles
  input: {
    base: 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
    field: 'w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  },

  // Table styles
  table: {
    container: 'overflow-x-auto',
    base: 'w-full border-collapse border border-gray-300 dark:border-gray-700',
    header: 'bg-gray-100 dark:bg-gray-800',
    cell: 'border border-gray-300 dark:border-gray-700 px-4 py-3',
    row: 'hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors',
  },

  // Text styles
  text: {
    heading: 'text-3xl font-bold mb-8',
    heading2: 'text-2xl font-semibold mb-2',
    heading3: 'text-lg font-medium',
    body: 'text-sm',
    muted: 'text-gray-500 dark:text-gray-400',
    error: 'text-red-700 dark:text-red-300',
    link: 'text-blue-600 dark:text-blue-400 hover:underline',
  },

  // Layout styles
  layout: {
    container: 'min-h-screen bg-background text-foreground p-8',
    content: 'max-w-7xl mx-auto',
    center: 'text-center',
    flex: {
      row: 'flex gap-4',
      rowSmall: 'flex gap-2',
      between: 'flex justify-between items-start',
      start: 'flex items-start',
    },
  },

  // Error/Alert styles
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6',
    icon: 'h-5 w-5 text-red-400',
    title: 'text-sm font-medium text-red-800 dark:text-red-200',
    message: 'mt-1 text-sm text-red-700 dark:text-red-300',
  },

  // Empty state styles
  emptyState: {
    container: 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center',
    icon: 'mx-auto h-12 w-12 text-gray-400',
    title: 'mt-4 text-lg font-medium text-gray-900 dark:text-gray-100',
    description: 'mt-2 text-sm text-gray-500 dark:text-gray-400',
  },
} as const;

/**
 * Utility function to combine class names
 * Filters out falsy values and joins remaining classes with spaces
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

