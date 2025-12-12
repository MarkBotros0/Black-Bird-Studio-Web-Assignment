'use client';

import Button from '../../ui/Button';
import { styles } from '../../../styles';

/**
 * Props for RowActions component
 */
interface RowActionsProps {
  /** Whether the row is in edit mode */
  isEditing: boolean;
  /** Handler to start editing */
  onEdit: () => void;
  /** Handler to save changes */
  onSave: () => void;
  /** Handler to cancel editing */
  onCancel: () => void;
}

/**
 * Component for row action buttons (Edit, Save, Cancel)
 *
 * @param props - Component props
 * @returns Rendered row actions component
 */
export default function RowActions({
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: RowActionsProps) {
  if (isEditing) {
    return (
      <div className={styles.layout.flex.rowSmall}>
        <Button
          variant="success"
          onClick={onSave}
          aria-label="Save changes"
        >
          Save
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          aria-label="Cancel editing"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="primary" onClick={onEdit} aria-label="Edit row">
      Edit
    </Button>
  );
}

