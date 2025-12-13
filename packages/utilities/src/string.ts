/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

/**
 * Capitalize the first letter of a string
 */
export const capitalizeWord = (value: string): string => {
  const trimmed = value.trim().toLowerCase();
  return trimmed ? trimmed[0].toUpperCase() + trimmed.slice(1) : '';
};

/**
 * Capitalize every word in a string
 */
export const capitalizeWords = (words: string): string =>
  words
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase()); // Unicode-safe

/**
 * Get initials from words (e.g. "John Doe" → "JD")
 */
export const initialize = (words: string): string =>
  words
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join('');

/**
 * Split full name into first and last parts
 */
export const segmentFullName = (
  fullName: string
): { first: string; last: string } => {
  const trimmed = fullName.trim();
  if (!trimmed) return { first: '', last: '' };

  const parts = trimmed.split(/\s+/);
  return parts.length === 1
    ? { first: parts[0], last: '' }
    : { first: parts.slice(0, -1).join(' '), last: parts.at(-1) ?? '' };
};

/**
 * Fuzzy search/filter for arrays of objects based on field value.
 * Matches characters in order regardless of spacing.
 *
 * @param items - array to search
 * @param searchString - string to search for
 * @param getField - function to extract searchable string from item
 * @returns filtered array
 */
export const filterSearch = <T>(
  items: T[],
  searchString: string,
  getField: (item: T) => string | undefined
): T[] => {
  if (!searchString.trim()) return items;

  const normalizedSearch = searchString.toLowerCase().replace(/\s+/g, '');

  return items.filter((item) => {
    const fieldValue = getField(item);
    if (!fieldValue) return false;

    const normalizedField = fieldValue.toLowerCase().replace(/\s+/g, '');
    let searchIndex = 0;

    for (
      let i = 0;
      i < normalizedField.length && searchIndex < normalizedSearch.length;
      i++
    ) {
      if (normalizedField[i] === normalizedSearch[searchIndex]) searchIndex++;
    }

    return searchIndex === normalizedSearch.length;
  });
};

/**
 * Extract the local part of an email (before @)
 */
export const getEmailLocalPart = (email: string): string => {
  const atIndex = email.indexOf('@');
  return atIndex !== -1 ? email.slice(0, atIndex) : email;
};
