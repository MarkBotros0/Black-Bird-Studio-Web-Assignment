'use client';

import ColumnResizer from './ColumnResizer';
import HeaderCell from './RssTableHeader/HeaderCell';
import { styles } from '../../styles';

/**
 * Props for RssTableHeader component
 */
interface RssTableHeaderProps {
  /** Array of field names to display as columns */
  fields: string[];
  /** Function to get column width for a field */
  getColumnWidth: (field: string) => string;
  /** Currently resizing field name */
  isResizing: string | null;
  /** Handler for mouse down on resizer */
  onResizeStart: (field: string, e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Table header component with resizable columns
 *
 * @param props - Component props
 * @returns Rendered table header
 */
export default function RssTableHeader({
  fields,
  getColumnWidth,
  isResizing,
  onResizeStart,
}: RssTableHeaderProps) {
  return (
    <thead>
      <tr className={styles.table.header}>
        {fields.map((field, index) => (
          <HeaderCell
            key={field}
            field={field}
            width={getColumnWidth(field)}
            isLast={index === fields.length - 1}
            isResizing={isResizing === field}
            onResizeStart={(e) => onResizeStart(field, e)}
          />
        ))}
        <th className={`${styles.table.cell} text-left font-semibold relative`}>
          Actions
          {/* Resizer before Actions column */}
          {fields.length > 0 && (
            <ColumnResizer
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onResizeStart(fields[fields.length - 1], e);
              }}
              isResizing={isResizing === fields[fields.length - 1]}
            />
          )}
        </th>
      </tr>
    </thead>
  );
}

