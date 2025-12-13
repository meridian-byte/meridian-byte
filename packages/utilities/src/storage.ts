'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

/**
 * Save an item to localStorage after serializing it to JSON.
 *
 * @param name - key to save under
 * @param item - value to store (any serializable object)
 */
export const saveToLocalStorage = (name: string, item: any): void => {
  if (typeof window === 'undefined') return;

  try {
    const serializedItem = JSON.stringify(item);
    localStorage.setItem(name, serializedItem);
  } catch (error) {
    console.error('---> utility error (save to local storage):', error);
  }
};

/**
 * Retrieve an item from localStorage and parse it from JSON.
 *
 * @param name - key to retrieve
 * @returns parsed object or null if missing/invalid
 */
export const getFromLocalStorage = (name: string): any | null => {
  if (typeof window === 'undefined') return null;

  try {
    const serializedItem = localStorage.getItem(name);
    return serializedItem ? JSON.parse(serializedItem) : null;
  } catch (error) {
    console.error('---> utility error (get from local storage):', error);
    return null;
  }
};

/**
 * Remove an item from localStorage.
 *
 * @param name - key to remove
 */
export const removeFromLocalStorage = (name: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(name);
  } catch (error) {
    console.error('---> utility error (remove from local storage):', error);
  }
};

/**
 * Save an item to sessionStorage after serializing it to JSON.
 *
 * @param name - key to save under
 * @param item - value to store (any serializable object)
 */
export const saveToSessionStorage = (name: string, item: any): void => {
  if (typeof window === 'undefined') return;

  try {
    const serializedItem = JSON.stringify(item);
    sessionStorage.setItem(name, serializedItem);
  } catch (error) {
    console.error('---> utility error (save to session storage):', error);
  }
};

/**
 * Retrieve an item from sessionStorage and parse it from JSON.
 *
 * @param name - key to retrieve
 * @returns parsed object or null if missing/invalid
 */
export const getFromSessionStorage = (name: string): any | null => {
  if (typeof window === 'undefined') return null;

  try {
    const serializedItem = sessionStorage.getItem(name);
    return serializedItem ? JSON.parse(serializedItem) : null;
  } catch (error) {
    console.error('---> utility error (get from session storage):', error);
    return null;
  }
};

/**
 * Remove an item from sessionStorage.
 *
 * @param name - key to remove
 */
export const removeFromSessionStorage = (name: string): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(name);
  } catch (error) {
    console.error('---> utility error (remove from session storage):', error);
  }
};
