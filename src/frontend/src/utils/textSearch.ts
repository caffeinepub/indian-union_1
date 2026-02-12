/**
 * Shared utility for case-insensitive text search across the application.
 * Normalizes strings and guards against empty queries.
 */

/**
 * Normalizes a string for case-insensitive comparison
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Checks if a search query matches any of the provided text fields
 * @param query - The search query string
 * @param fields - Array of text fields to search within
 * @returns true if query matches any field (case-insensitive)
 */
export function matchesSearch(query: string, fields: string[]): boolean {
  if (!query || query.trim() === '') {
    return true; // Empty query matches everything
  }

  const normalizedQuery = normalizeText(query);
  
  return fields.some(field => 
    normalizeText(field).includes(normalizedQuery)
  );
}

/**
 * Filters an array of items based on a search query
 * @param items - Array of items to filter
 * @param query - Search query string
 * @param getSearchFields - Function that extracts searchable fields from an item
 * @returns Filtered array of items
 */
export function filterBySearch<T>(
  items: T[],
  query: string,
  getSearchFields: (item: T) => string[]
): T[] {
  if (!query || query.trim() === '') {
    return items;
  }

  return items.filter(item => 
    matchesSearch(query, getSearchFields(item))
  );
}
