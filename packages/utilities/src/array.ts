/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { Order } from '@repo/types/enums';

/**
 * Checks if the given item is the first element in the array.
 */
export const isFirstItem = <T>(array: T[], item: T): boolean =>
  array[0] === item;

/**
 * Checks if the given item is the last element in the array.
 */
export const isLastItem = <T>(array: T[], item: T): boolean =>
  array[array.length - 1] === item;

/**
 * Sorts an array by a specific field with optional ordering.
 * Items with `null` or `undefined` fields are placed at the end.
 */
export const sortArray = <T, K>(
  array: T[],
  getField: (item: T) => K | null | undefined,
  order: Order
): T[] => {
  // Split valid and null/undefined items
  const [valid, invalid] = array.reduce<[T[], T[]]>(
    ([v, n], item) =>
      getField(item) == null ? [v, [...n, item]] : [[...v, item], n],
    [[], []]
  );

  const sortedValid = [...valid].sort((a, b) => {
    const aValue = getField(a);
    const bValue = getField(b);

    if (aValue === bValue) return 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === Order.ASCENDING
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === Order.ASCENDING ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return order === Order.ASCENDING
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Types are inconsistent or non-comparable
    throw new Error(
      `Cannot compare values of types ${typeof aValue} and ${typeof bValue}`
    );
  });

  return [...sortedValid, ...invalid];
};

/**
 * Shuffles an array using Fisher-Yates algorithm.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Clean an array of paths: remove fragments (#) and duplicates
 */
export const cleanPaths = (paths: string[]): string[] => {
  const cleaned = paths.map((path) => path.split('#')[0]); // remove anything after #
  return Array.from(new Set(cleaned)); // remove duplicates
};
