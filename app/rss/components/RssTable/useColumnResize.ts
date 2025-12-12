import { useState, useCallback, useRef, useEffect, useMemo, useReducer } from 'react';
import { DEFAULT_COLUMN_WIDTHS, MIN_COLUMN_WIDTH } from '../../constants';
import { getFieldTypeCategory } from '../../utils/fieldTypeDetection';

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
  const fieldType = getFieldTypeCategory(field);

  switch (fieldType) {
    case 'title':
      return DEFAULT_COLUMN_WIDTHS.TITLE;
    case 'description':
      return DEFAULT_COLUMN_WIDTHS.DESCRIPTION;
    case 'date':
      return DEFAULT_COLUMN_WIDTHS.DATE;
    case 'link':
      return DEFAULT_COLUMN_WIDTHS.LINK;
    case 'image':
      return DEFAULT_COLUMN_WIDTHS.IMAGE;
    case 'author':
      return DEFAULT_COLUMN_WIDTHS.AUTHOR;
    case 'category':
      return DEFAULT_COLUMN_WIDTHS.CATEGORY;
    default:
      return DEFAULT_COLUMN_WIDTHS.DEFAULT;
  }
}

/**
 * Action type for column widths reducer
 */
type ColumnWidthsAction =
  | { type: 'ADD_FIELDS'; fields: string[]; initialWidths: ColumnWidths }
  | { type: 'SET_WIDTH'; field: string; width: number };

/**
 * Reducer for managing column widths state
 */
function columnWidthsReducer(
  state: ColumnWidths,
  action: ColumnWidthsAction
): ColumnWidths {
  switch (action.type) {
    case 'ADD_FIELDS': {
      const updated = { ...state };
      let hasChanges = false;
      for (const field of action.fields) {
        if (!field || updated[field]) continue;
        updated[field] = action.initialWidths[field];
        hasChanges = true;
      }
      return hasChanges ? updated : state;
    }
    case 'SET_WIDTH': {
      if (state[action.field] === action.width) return state;
      return { ...state, [action.field]: action.width };
    }
    default:
      return state;
  }
}

/**
 * Hook for managing draggable column resizing
 *
 * @param fields - Array of field names to create columns for
 * @returns Object containing resize state and handlers
 */
export function useColumnResize(fields: string[]): UseColumnResizeReturn {
  // Compute initial widths using useMemo
  const initialWidths = useMemo<ColumnWidths>(() => {
    const initial: ColumnWidths = {};
    if (fields && fields.length > 0) {
      fields.forEach((field) => {
        if (field) {
          initial[field] = getInitialWidth(field);
        }
      });
    }
    return initial;
  }, [fields]);

  const [columnWidths, dispatch] = useReducer(columnWidthsReducer, initialWidths);
  const columnWidthsRef = useRef<ColumnWidths>(columnWidths);
  const processedFieldsRef = useRef<Set<string>>(new Set());
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    columnWidthsRef.current = columnWidths;
  }, [columnWidths]);

  // Add new fields using reducer in effect
  useEffect(() => {
    if (!fields || fields.length === 0) return;

    const newFields = fields.filter((field) => field && !processedFieldsRef.current.has(field));
    if (newFields.length === 0) return;

    newFields.forEach((field) => processedFieldsRef.current.add(field));
    dispatch({ type: 'ADD_FIELDS', fields: newFields, initialWidths });
  }, [fields, initialWidths]);

  /**
   * Creates a mouse move handler for column resizing
   *
   * @param field - Field name being resized
   * @returns Mouse move event handler
   */
  const createMouseMoveHandler = useCallback(
    (field: string) => {
      return (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startXRef.current;
        const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidthRef.current + diff);

        dispatch({ type: 'SET_WIDTH', field, width: newWidth });
      };
    },
    []
  );

  /**
   * Creates a mouse up handler to stop column resizing
   *
   * @param handleMouseMove - Mouse move handler to remove
   * @returns Mouse up event handler
   */
  const createMouseUpHandler = useCallback(
    (handleMouseMove: (e: MouseEvent) => void) => {
      const handler = () => {
        setIsResizing(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handler);
      };
      return handler;
    },
    []
  );

  /**
   * Initializes column resize operation
   *
   * @param field - Field name to resize
   * @param startX - Initial mouse X position
   */
  const initializeResize = useCallback((field: string, startX: number) => {
    setIsResizing(field);
    startXRef.current = startX;
    const currentWidth = columnWidthsRef.current[field] || getInitialWidth(field);
    startWidthRef.current = currentWidth;
  }, []);

  /**
   * Attaches resize event listeners
   *
   * @param handleMouseMove - Mouse move handler
   * @param handleMouseUp - Mouse up handler
   */
  const attachResizeListeners = useCallback(
    (handleMouseMove: (e: MouseEvent) => void, handleMouseUp: () => void) => {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp, { once: true });
    },
    []
  );

  const handleMouseDown = useCallback(
    (field: string, e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!field) return;

      initializeResize(field, e.clientX);
      const handleMouseMove = createMouseMoveHandler(field);
      const handleMouseUp = createMouseUpHandler(handleMouseMove);
      attachResizeListeners(handleMouseMove, handleMouseUp);
    },
    [initializeResize, createMouseMoveHandler, createMouseUpHandler, attachResizeListeners]
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

