'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { RssItem } from '../types/rss';
import RssTableRow from './RssTable/RssTableRow';
import RssTableHeader from './RssTable/RssTableHeader';
import EmptyTableState from './RssTable/EmptyTableState';
import { getAllFields } from './RssTable/utils';
import { hasAttributes, createFieldValue, parseFieldValue } from '../utils/fieldParsing';
import { useColumnResize } from './RssTable/useColumnResize';
import { styles } from '../styles';

/**
 * Props for RssTable component
 */
interface RssTableProps {
  /** Array of RSS items to display */
  items: RssItem[];
  /** Callback when items are modified */
  onItemsChange: (items: RssItem[]) => void;
}

/**
 * Main RSS table component with editable rows and resizable columns
 *
 * @param props - Component props
 * @returns Rendered RSS table component
 */
export default function RssTable({ items, onItemsChange }: RssTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedItems, setEditedItems] = useState<RssItem[]>(items);

  useEffect(() => {
    if (editingIndex === null) {
      setEditedItems([...items]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, editingIndex]);

  const allFields = useMemo(() => getAllFields(items), [items]);
  const { isResizing, handleMouseDown, getColumnWidth } = useColumnResize(allFields);

  /**
   * Handles starting edit mode for a row
   */
  const handleEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setEditedItems([...items]);
  }, [items]);

  /**
   * Handles saving edited row
   */
  const handleSave = useCallback((index: number) => {
    onItemsChange(editedItems);
    setEditingIndex(null);
  }, [editedItems, onItemsChange]);

  /**
   * Handles canceling edit mode
   */
  const handleCancel = useCallback(() => {
    setEditedItems([...items]);
    setEditingIndex(null);
  }, [items]);

  /**
   * Handles field value changes during editing
   * Preserves XML attributes when updating field values
   */
  const handleFieldChange = useCallback(
    (index: number, field: string, value: string) => {
      setEditedItems((prev) => {
        if (index < 0 || index >= prev.length) {
          return prev;
        }

        const updated = [...prev];
        const currentItem = updated[index];
        if (!currentItem) {
          return prev;
        }

        const currentValue = currentItem[field];

        if (hasAttributes(currentValue)) {
          const parsed = parseFieldValue(currentValue);
          updated[index] = {
            ...currentItem,
            [field]: createFieldValue(value, parsed.attributes),
          };
        } else {
          updated[index] = {
            ...currentItem,
            [field]: value,
          };
        }
        return updated;
      });
    },
    []
  );

  if (items.length === 0) {
    return (
      <EmptyTableState message="No RSS items to display. Fetch a feed to get started." />
    );
  }

  if (allFields.length === 0) {
    return <EmptyTableState message="No fields found in RSS items." />;
  }

  return (
    <div
      className={styles.table.container}
      style={{ userSelect: isResizing ? 'none' : 'auto' }}
    >
      <table
        className={styles.table.base}
        style={{ tableLayout: 'fixed' }}
        role="table"
        aria-label="RSS feed items table"
      >
        <RssTableHeader
          fields={allFields}
          getColumnWidth={getColumnWidth}
          isResizing={isResizing}
          onResizeStart={handleMouseDown}
        />
        <tbody>
          {items.map((item, index) => {
            const isEditing = editingIndex === index;
            const editedItem = editedItems[index] || item;

            return (
              <RssTableRow
                key={`row-${index}`}
                item={item}
                editedItem={editedItem}
                fields={allFields}
                index={index}
                isEditing={isEditing}
                onFieldChange={(field: string, value: string) =>
                  handleFieldChange(index, field, value)
                }
                onEdit={() => handleEdit(index)}
                onSave={() => handleSave(index)}
                onCancel={handleCancel}
                getColumnWidth={getColumnWidth}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
