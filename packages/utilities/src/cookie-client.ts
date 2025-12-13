'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

type CookieOptions = {
  expiryInSeconds: number;
  sameSite?: 'Strict' | 'Lax' | 'None';
  path?: string;
  secure?: boolean; // Only sent over HTTPS
};

/**
 * Sets a cookie in the browser with optional secure flag.
 * Automatically JSON-stringifies objects and encodes values.
 */
export const setCookieClient = (
  name: string,
  value: any,
  options: CookieOptions
): void => {
  if (typeof document === 'undefined') return;

  const cookieValue =
    typeof value === 'object'
      ? encodeURIComponent(JSON.stringify(value))
      : encodeURIComponent(value);

  const expires = new Date(
    Date.now() + options.expiryInSeconds * 1000
  ).toUTCString();
  const sameSite = options.sameSite ?? 'Strict';
  const path = options.path ?? '/';
  const secure = options.secure ? '; Secure' : '';

  document.cookie = `${name}=${cookieValue}; expires=${expires}; SameSite=${sameSite}; path=${path}${secure}`;
};

/**
 * Retrieves a cookie value by name.
 * Attempts to parse JSON automatically.
 */
export const getCookieClient = <T = string>(name: string): T | null => {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`));

  if (!cookie) return null;

  const value = decodeURIComponent(cookie.split('=')[1]);

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

/**
 * Deletes a cookie by name.
 */
export const deleteCookieClient = (name: string, path: string = '/') => {
  setCookieClient(name, '', { expiryInSeconds: -1, path });
};
