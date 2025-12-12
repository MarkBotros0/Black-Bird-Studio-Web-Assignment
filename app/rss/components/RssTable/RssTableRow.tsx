'use client';

import { memo } from 'react';
import type { RssItem } from '../../types/rss';
import FieldDisplay from './FieldDisplay';
import FieldEditor from './FieldEditor';
import RowActions from './RssTableRow/RowActions';
import { MIN_COLUMN_WIDTH } from '../../constants';
import { styles } from '../../styles';

/**
 * Props for RssTableRow component
 */
interface RssTableRowProps {
  /** Original RSS item data */
  item: RssItem;
  /** Edited RSS item data (when in edit mode) */
  editedItem: RssItem;
  /** Array of field names to display */
  fields: string[];
  /** Row index */
  index: number;
  /** Whether the row is in edit mode */
  isEditing: boolean;
  /** Handler for field value changes */
  onFieldChange: (field: string, value: string) => void;
  /** Handler to start editing */
  onEdit: () => void;
  /** Handler to save changes */
  onSave: () => void;
  /** Handler to cancel editing */
  onCancel: () => void;
  /** Function to get column width for a field */
  getColumnWidth: (field: string) => string;
}

/**
 * Table row component for displaying and editing RSS items
 * Memoized to prevent unnecessary re-renders when props haven't changed
 *
 * @param props - Component props
 * @returns Rendered table row component
 */
function RssTableRow({
  item,
  editedItem,
  fields,
  index,
  isEditing,
  onFieldChange,
  onEdit,
  onSave,
  onCancel,
  getColumnWidth,
}: RssTableRowProps) {
  const displayItem = isEditing ? editedItem : item;

  return (
    <tr className={styles.table.row}>
      {fields.map((field) => (
        <td
          key={field}
          className={`${styles.table.cell} break-words`}
          style={{
            width: getColumnWidth(field),
            minWidth: `${MIN_COLUMN_WIDTH}px`,
          }}
        >
          {isEditing ? (
            <FieldEditor
              field={field}
              value={displayItem[field]}
              onChange={(value) => onFieldChange(field, value)}
            />
          ) : (
            <FieldDisplay field={field} value={displayItem[field]} />
          )}
        </td>
      ))}
      <td className={styles.table.cell}>
        <RowActions
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      </td>
    </tr>
  );
}

// Memoize component to prevent re-renders when props haven't changed
// Note: Callbacks are compared by reference, so they should be memoized
// with useCallback in the parent component for optimal performance
export default memo(RssTableRow);

