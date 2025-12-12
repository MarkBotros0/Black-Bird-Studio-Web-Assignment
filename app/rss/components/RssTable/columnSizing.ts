/**
 * Determines optimal column width class based on field name and type
 * Returns Tailwind CSS classes for min/max width constraints
 *
 * @param fieldName - Name of the field to determine width for
 * @returns Tailwind CSS classes string with min-width and max-width constraints
 */
export function getColumnWidthClass(fieldName: string): string {
  const lowerField = fieldName.toLowerCase();

  if (lowerField.includes('title') || lowerField.includes('name')) {
    return 'min-w-[200px] max-w-[300px]';
  }

  if (
    lowerField.includes('description') ||
    lowerField.includes('content') ||
    lowerField.includes('summary')
  ) {
    return 'min-w-[250px] max-w-[400px]';
  }

  if (lowerField.includes('date') || lowerField.includes('time') || lowerField.includes('pubdate')) {
    return 'min-w-[150px] max-w-[200px]';
  }

  if (lowerField.includes('link') || lowerField.includes('url') || lowerField.includes('guid')) {
    return 'min-w-[200px] max-w-[350px]';
  }

  if (
    lowerField.includes('image') ||
    lowerField.includes('img') ||
    lowerField.includes('thumbnail') ||
    lowerField.includes('media')
  ) {
    return 'min-w-[120px] max-w-[150px]';
  }

  if (lowerField.includes('author') || lowerField.includes('creator')) {
    return 'min-w-[150px] max-w-[200px]';
  }

  if (lowerField.includes('category') || lowerField.includes('tag')) {
    return 'min-w-[120px] max-w-[180px]';
  }

  return 'min-w-[150px] max-w-[250px]';
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

