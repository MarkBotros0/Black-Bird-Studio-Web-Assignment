import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColumnResize } from '../useColumnResize';

describe('useColumnResize', () => {
  beforeEach(() => {
    // Mock document methods
    global.document.addEventListener = vi.fn();
    global.document.removeEventListener = vi.fn();
  });

  describe('initial state', () => {
    it('should initialize with default column widths', () => {
      const fields = ['title', 'description', 'link'];
      const { result } = renderHook(() => useColumnResize(fields));

      expect(result.current.columnWidths).toBeDefined();
      expect(result.current.columnWidths.title).toBeDefined();
      expect(result.current.columnWidths.description).toBeDefined();
      expect(result.current.columnWidths.link).toBeDefined();
      expect(result.current.isResizing).toBeNull();
    });

    it('should handle empty fields array', () => {
      const { result } = renderHook(() => useColumnResize([]));

      expect(result.current.columnWidths).toEqual({});
      expect(result.current.isResizing).toBeNull();
    });
  });

  describe('getColumnWidth', () => {
    it('should return width in pixels for existing field', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const width = result.current.getColumnWidth('title');
      expect(width).toMatch(/^\d+px$/);
    });

    it('should return auto for non-existent field', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const width = result.current.getColumnWidth('nonexistent');
      expect(width).toBe('auto');
    });

    it('should return auto for empty field name', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const width = result.current.getColumnWidth('');
      expect(width).toBe('auto');
    });
  });

  describe('handleMouseDown', () => {
    it('should set isResizing when mouse down on resizer', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      act(() => {
        result.current.handleMouseDown('title', mockEvent);
      });

      expect(result.current.isResizing).toBe('title');
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(global.document.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
        { passive: true }
      );
      expect(global.document.addEventListener).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function),
        { once: true }
      );
    });

    it('should not set isResizing for empty field', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      act(() => {
        result.current.handleMouseDown('', mockEvent);
      });

      expect(result.current.isResizing).toBeNull();
    });

    it('should update column width on mouse move', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const initialWidth = result.current.columnWidths.title;
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      act(() => {
        result.current.handleMouseDown('title', mockEvent);
      });

      // Simulate mouse move
      const moveHandler = (global.document.addEventListener as ReturnType<
        typeof vi.fn
      >).mock.calls.find(
        (call) => call[0] === 'mousemove'
      )?.[1] as (e: MouseEvent) => void;

      expect(moveHandler).toBeDefined();

      act(() => {
        const moveEvent = {
          clientX: 200, // Moved 100px to the right
        } as MouseEvent;
        moveHandler(moveEvent);
      });

      // Width should have increased (or stayed the same if at minimum)
      const newWidth = result.current.columnWidths.title;
      expect(newWidth).toBeGreaterThanOrEqual(initialWidth);
    });

    it('should stop resizing on mouse up', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      act(() => {
        result.current.handleMouseDown('title', mockEvent);
      });

      expect(result.current.isResizing).toBe('title');

      // Simulate mouse up
      const upHandler = (global.document.addEventListener as ReturnType<
        typeof vi.fn
      >).mock.calls.find((call) => call[0] === 'mouseup')?.[1] as () => void;

      expect(upHandler).toBeDefined();

      act(() => {
        upHandler();
      });

      expect(result.current.isResizing).toBeNull();
      expect(global.document.removeEventListener).toHaveBeenCalled();
    });

    it('should respect minimum column width', () => {
      const fields = ['title'];
      const { result } = renderHook(() => useColumnResize(fields));

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 1000,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      act(() => {
        result.current.handleMouseDown('title', mockEvent);
      });

      // Simulate mouse move to very small width
      const moveHandler = (global.document.addEventListener as ReturnType<
        typeof vi.fn
      >).mock.calls.find(
        (call) => call[0] === 'mousemove'
      )?.[1] as (e: MouseEvent) => void;

      act(() => {
        const moveEvent = {
          clientX: 0, // Try to make it very small
        } as MouseEvent;
        moveHandler(moveEvent);
      });

      // Width should be at least MIN_COLUMN_WIDTH (100px)
      const width = result.current.columnWidths.title;
      expect(width).toBeGreaterThanOrEqual(100);
    });
  });

  describe('dynamic fields', () => {
    it('should add widths for new fields', () => {
      const { result, rerender } = renderHook(
        ({ fields }) => useColumnResize(fields),
        {
          initialProps: { fields: ['title'] },
        }
      );

      expect(result.current.columnWidths.title).toBeDefined();
      expect(result.current.columnWidths.description).toBeUndefined();

      rerender({ fields: ['title', 'description'] });

      expect(result.current.columnWidths.title).toBeDefined();
      expect(result.current.columnWidths.description).toBeDefined();
    });

    it('should preserve existing widths when fields change', () => {
      const { result, rerender } = renderHook(
        ({ fields }) => useColumnResize(fields),
        {
          initialProps: { fields: ['title'] },
        }
      );

      const originalWidth = result.current.columnWidths.title;

      // Resize the column
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      act(() => {
        result.current.handleMouseDown('title', mockEvent);
      });

      const moveHandler = (global.document.addEventListener as ReturnType<
        typeof vi.fn
      >).mock.calls.find(
        (call) => call[0] === 'mousemove'
      )?.[1] as (e: MouseEvent) => void;

      act(() => {
        const moveEvent = { clientX: 300 } as MouseEvent;
        moveHandler(moveEvent);
      });

      const upHandler = (global.document.addEventListener as ReturnType<
        typeof vi.fn
      >).mock.calls.find((call) => call[0] === 'mouseup')?.[1] as () => void;

      act(() => {
        upHandler();
      });

      const resizedWidth = result.current.columnWidths.title;

      // Add new field
      rerender({ fields: ['title', 'description'] });

      // Original field width should be preserved
      expect(result.current.columnWidths.title).toBe(resizedWidth);
      expect(result.current.columnWidths.title).not.toBe(originalWidth);
    });
  });
});

