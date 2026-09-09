'use client';

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
export const setCookieClient = (name: string, value: any, options: CookieOptions): void => {
  if (typeof document === 'undefined') return;

  const cookieValue =
    value && typeof value === 'object'
      ? encodeURIComponent(JSON.stringify(value))
      : encodeURIComponent(value);

  const expires = new Date(Date.now() + options.expiryInSeconds * 1000).toUTCString();
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

  // Escaping the name is safer in case it contains special regex characters
  const escapedName = name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
  const match = document.cookie.match(new RegExp('(^| )' + escapedName + '=([^;]+)'));

  // 1. Fix: Ensure match exists before accessing index 2
  if (!match || !match[2]) return null;

  const value = decodeURIComponent(match[2]);

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
