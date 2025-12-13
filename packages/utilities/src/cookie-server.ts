'use server';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { cookies } from 'next/headers';

type CookieServerOptions = {
  expiryInSeconds: number;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
};

/**
 * Retrieves a cookie from server-side context.
 * Automatically decodes value.
 */
export const getCookieServer = async <T = string>(
  cookieName: string
): Promise<T | null> => {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName);

    if (!cookie) return null;

    const value = decodeURIComponent(cookie.value);

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error('---> utility error (get cookie value):', error);
    return null;
  }
};

/**
 * Sets a cookie in the server-side context.
 * Supports JSON values, HttpOnly, Secure, SameSite, and path.
 */
export const setCookieServer = async (
  name: string,
  value: any,
  options: CookieServerOptions
): Promise<void> => {
  try {
    const cookieValue =
      typeof value === 'object'
        ? encodeURIComponent(JSON.stringify(value))
        : encodeURIComponent(value);

    const expires = new Date(Date.now() + options.expiryInSeconds * 1000);

    const cookieStore = await cookies();
    cookieStore.set({
      name,
      value: cookieValue,
      expires,
      path: options.path || '/',
      sameSite: options.sameSite || 'strict',
      secure: options.secure ?? false,
      httpOnly: options.httpOnly ?? true, // default HttpOnly true for server cookies
    });
  } catch (error) {
    console.error('---> utility error (set cookie value):', error);
  }
};

/**
 * Deletes a server-side cookie by name.
 */
export const deleteCookieServer = async (name: string, path: string = '/') => {
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value: '',
    expires: new Date(0),
    path,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
};
