import { useState, useCallback, useRef, useEffect } from 'react';
import { DEFAULT_COLUMN_WIDTHS, MIN_COLUMN_WIDTH } from '../../constants';

/**
 * Map of field names to column widths
 */
interface ColumnWidths {
  [field: string]: number;
}

/**
 * Return type for useColumnResize hook
 */
export interface UseColumnResizeReturn {
  /** Map of column widths */
  columnWidths: ColumnWidths;
  /** Currently resizing field name */
  isResizing: string | null;
  /** Handler for mouse down on resizer */
  handleMouseDown: (field: string, e: React.MouseEvent<HTMLDivElement>) => void;
  /** Get column width for a field */
  getColumnWidth: (field: string) => string;
}

/**
 * Gets initial width for a field based on its type
 *
 * @param field - Field name to get width for
 * @returns Initial width in pixels
 */
function getInitialWidth(field: string): number {
  const lowerField = field.toLowerCase();

  if (lowerField.includes('title') || lowerField.includes('name')) {
    return DEFAULT_COLUMN_WIDTHS.TITLE;
  }
  if (
    lowerField.includes('description') ||
    lowerField.includes('content') ||
    lowerField.includes('summary')
  ) {
    return DEFAULT_COLUMN_WIDTHS.DESCRIPTION;
  }
  if (
    lowerField.includes('date') ||
    lowerField.includes('time') ||
    lowerField.includes('pubdate')
  ) {
    return DEFAULT_COLUMN_WIDTHS.DATE;
  }
  if (
    lowerField.includes('link') ||
    lowerField.includes('url') ||
    lowerField.includes('guid')
  ) {
    return DEFAULT_COLUMN_WIDTHS.LINK;
  }
  if (
    lowerField.includes('image') ||
    lowerField.includes('img') ||
    lowerField.includes('thumbnail') ||
    lowerField.includes('media')
  ) {
    return DEFAULT_COLUMN_WIDTHS.IMAGE;
  }
  if (lowerField.includes('author') || lowerField.includes('creator')) {
    return DEFAULT_COLUMN_WIDTHS.AUTHOR;
  }
  if (lowerField.includes('category') || lowerField.includes('tag')) {
    return DEFAULT_COLUMN_WIDTHS.CATEGORY;
  }
  return DEFAULT_COLUMN_WIDTHS.DEFAULT;
}

/**
 * Hook for managing draggable column resizing
 *
 * @param fields - Array of field names to create columns for
 * @returns Object containing resize state and handlers
 */
export function useColumnResize(fields: string[]): UseColumnResizeReturn {
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(() => {
    const initial: ColumnWidths = {};
    fields.forEach((field) => {
      initial[field] = getInitialWidth(field);
    });
    return initial;
  });

  const columnWidthsRef = useRef<ColumnWidths>(columnWidths);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    columnWidthsRef.current = columnWidths;
  }, [columnWidths]);

  useEffect(() => {
    if (!fields || fields.length === 0) return;

    setColumnWidths((prev) => {
      let hasChanges = false;
      const updated = { ...prev };

      for (const field of fields) {
        if (!field || updated[field]) continue;
        updated[field] = getInitialWidth(field);
        hasChanges = true;
      }

      return hasChanges ? updated : prev;
    });
  }, [fields]);

  const handleMouseDown = useCallback(
    (field: string, e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!field) return;

      setIsResizing(field);
      startXRef.current = e.clientX;
      const currentWidth = columnWidthsRef.current[field] || getInitialWidth(field);
      startWidthRef.current = currentWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startXRef.current;
        const newWidth = Math.max(
          MIN_COLUMN_WIDTH,
          startWidthRef.current + diff
        );

        setColumnWidths((prev) => {
          if (prev[field] === newWidth) {
            return prev;
          }
          return {
            ...prev,
            [field]: newWidth,
          };
        });
      };

      const handleMouseUp = () => {
        setIsResizing(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp, { once: true });
    },
    []
  );

  const getColumnWidth = useCallback(
    (field: string): string => {
      if (!field) return 'auto';
      const width = columnWidths[field];
      return width ? `${width}px` : 'auto';
    },
    [columnWidths]
  );

  return {
    columnWidths,
    isResizing,
    handleMouseDown,
    getColumnWidth,
  };
}

