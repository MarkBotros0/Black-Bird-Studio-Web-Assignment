'use client';

/**
 * Props for ColumnResizer component
 */
interface ColumnResizerProps {
  /** Mouse down event handler */
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Whether the column is currently being resized */
  isResizing: boolean;
}

/**
 * Column resizer handle component
 * Displays a draggable handle for resizing table columns
 *
 * @param props - Component props
 * @returns Rendered column resizer component
 */
export default function ColumnResizer({
  onMouseDown,
  isResizing,
}: ColumnResizerProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`
        absolute right-0 top-0 h-full cursor-col-resize z-30
        flex items-center justify-center
        group
      `}
      style={{
        touchAction: 'none',
        width: '8px',
        marginRight: '-4px',
      }}
      role="separator"
      aria-label="Resize column"
      title="Drag to resize column"
    >
      {/* Visible resize handle bar - centered on the border */}
      <div
        className={`
          h-full transition-all
          ${isResizing ? 'bg-blue-500 w-1' : 'bg-gray-400 dark:bg-gray-500 w-0.5 group-hover:bg-blue-500 group-hover:w-1'}
        `}
      />
    </div>
  );
}

