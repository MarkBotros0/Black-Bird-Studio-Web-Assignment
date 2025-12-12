import { getFieldTypeCategory } from '../../utils/fieldTypeDetection';

/**
 * Determines optimal column width class based on field name and type
 * Returns Tailwind CSS classes for min/max width constraints
 *
 * @param fieldName - Name of the field to determine width for
 * @returns Tailwind CSS classes string with min-width and max-width constraints
 */
export function getColumnWidthClass(fieldName: string): string {
  const fieldType = getFieldTypeCategory(fieldName);
  
  switch (fieldType) {
    case 'title':
      return 'min-w-[200px] max-w-[300px]';
    case 'description':
      return 'min-w-[250px] max-w-[400px]';
    case 'date':
      return 'min-w-[150px] max-w-[200px]';
    case 'link':
      return 'min-w-[200px] max-w-[350px]';
    case 'image':
      return 'min-w-[120px] max-w-[150px]';
    case 'author':
      return 'min-w-[150px] max-w-[200px]';
    case 'category':
      return 'min-w-[120px] max-w-[180px]';
    default:
      return 'min-w-[150px] max-w-[250px]';
  }
}

/**
 * Gets all column width classes for a set of fields
 * Creates a mapping of field names to their corresponding width classes
 *
 * @param fields - Array of field names to generate width classes for
 * @returns Record mapping field names to their width class strings
 */
export function getColumnWidthClasses(fields: string[]): Record<string, string> {
  const widthMap: Record<string, string> = {};
  fields.forEach((field) => {
    widthMap[field] = getColumnWidthClass(field);
  });
  return widthMap;
}

