'use client';

import ColumnResizer from '../ColumnResizer';
import { styles } from '../../../styles';
import { MIN_COLUMN_WIDTH } from '../../../constants';

/**
 * Props for HeaderCell component
 */
interface HeaderCellProps {
  /** Field name */
  field: string;
  /** Column width */
  width: string;
  /** Whether this is the last field column */
  isLast: boolean;
  /** Whether the column is currently being resized */
  isResizing: boolean;
  /** Handler for resize start */
  onResizeStart: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Component for individual header cell with resizer
 *
 * @param props - Component props
 * @returns Rendered header cell component
 */
export default function HeaderCell({
  field,
  width,
  isLast,
  isResizing,
  onResizeStart,
}: HeaderCellProps) {
  const formattedFieldName = field.replace(/([A-Z])/g, ' $1').trim();

  return (
    <th
      className={`${styles.table.cell} text-left font-semibold capitalize relative select-none`}
      style={{
        width,
        minWidth: `${MIN_COLUMN_WIDTH}px`,
      }}
    >
      <span className="block truncate">{formattedFieldName}</span>
      {!isLast && (
        <ColumnResizer
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onResizeStart(e);
          }}
          isResizing={isResizing}
        />
      )}
    </th>
  );
}

