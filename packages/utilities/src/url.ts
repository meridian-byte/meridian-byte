/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { PARAM_NAME } from '@repo/constants/names';
import { capitalizeWords } from './string';

/**
 * Appends a redirect query parameter to a target URL
 */
export const setRedirectUrl = (params: {
  targetUrl: string;
  redirectUrl?: string;
  redirectParamName?: string;
}) => {
  const target = params.targetUrl;
  const redirect = params.redirectUrl || '';
  const paramName = params.redirectParamName || PARAM_NAME.REDIRECT;

  return `${target}?${paramName}=${encodeURIComponent(redirect)}`;
};

/**
 * Retrieves one or more query parameters from the current browser URL.
 * - If no parameter is provided, returns all parameters as an object.
 * - If a string is provided, returns that parameter's value.
 * - If an array is provided, returns an object with those parameters.
 */
export const getUrlParam = (
  paramNames?: string | string[]
): string | Record<string, string | null> | null => {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);

  // Return all params if no specific name(s) provided
  if (!paramNames) {
    const allParams: Record<string, string> = {};
    urlParams.forEach((value, key) => {
      allParams[key] = value;
    });
    return allParams;
  }

  // Return a single param
  if (typeof paramNames === 'string') {
    return urlParams.get(paramNames);
  }

  // Return multiple params
  const result: Record<string, string | null> = {};
  for (const name of paramNames) {
    result[name] = urlParams.get(name);
  }

  return result;
};

/**
 * Removes one or more query parameters from the current browser URL
 */
export const removeUrlParam = (paramNames: string | string[]): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const names = Array.isArray(paramNames) ? paramNames : [paramNames];

  names.forEach((name) => url.searchParams.delete(name));

  window.history.replaceState({}, '', url.toString());
};

/**
 * Adds, updates, or removes query parameters in the current browser URL.
 * If a value is null, undefined, or an empty string, that parameter will be removed.
 * @param params - Object of parameters to set or remove
 */
export const setUrlParam = (
  params: Record<string, string | null | undefined>
): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  // Update the URL without reloading the page
  window.history.replaceState({}, '', url.toString());
};

/**
 * Ensures a URL is absolute. If `link` is relative, it combines it with `host`.
 * Handles extra slashes gracefully.
 */
export const processUrl = (link: string, host: string): string => {
  // Remove trailing slash from host
  const cleanHost = host.replace(/\/+$/, '');

  try {
    // If link is already absolute, return normalized URL
    return new URL(link).toString();
  } catch {
    // Link is relative; remove leading slashes to prevent double slashes
    const cleanLink = link.replace(/^\/+/, '');
    return `${cleanHost}/${cleanLink}`;
  }
};

/**
 * Safely resolves a redirect URL from a request's query parameters
 * Ensures same-origin or relative redirects, otherwise falls back
 */
export function getSafeRedirectUrl(
  request: any,
  paramName: string,
  fallbackPath: string
): string {
  const { searchParams } = new URL(request.url);
  const paramValue = searchParams.get(paramName);
  const fallbackUrl = new URL(fallbackPath, request.url);

  try {
    if (!paramValue) return fallbackUrl.toString();

    const nextUrl = new URL(paramValue, request.url);
    const currentOrigin = new URL(request.url).origin;

    // Allow same-origin or relative URLs only
    if (paramValue.startsWith('/') || nextUrl.origin === currentOrigin) {
      return nextUrl.toString();
    }

    return fallbackUrl.toString();
  } catch {
    return fallbackUrl.toString();
  }
}

/**
 * Convert a URL path into breadcrumb segments
 */
export const crumbify = (url: string) => {
  const crumbs = [{ link: '/', label: 'Home' }];
  let currentLink = '';

  url
    .split('/')
    .filter(Boolean)
    .forEach((segment) => {
      currentLink += `/${segment}`;
      if (segment.length < 24) {
        crumbs.push({
          link: currentLink,
          label: capitalizeWords(segment.replaceAll('-', ' ')),
        });
      }
    });

  return crumbs;
};

/**
 * Convert string into a clean URL slug
 */
export const linkify = (str: string): string =>
  str
    .trim()
    .toLowerCase()
    .normalize('NFKD') // handle accents (e.g. é → e)
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Unicode-safe remove non-alphanumerics
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Extract a UUID from the end of a string, if present
 */
export function extractUuidFromParam(param: string): string | null {
  const uuidPattern =
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  const match = param.match(uuidPattern);
  return match ? match[0] : null;
}

/**
 * Extract the slug/title part from a param, removing the trailing UUID
 */
export function extractSlugFromParam(param: string): string | null {
  const uuidPattern =
    /-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  const title = param.replace(uuidPattern, '');
  return title || null;
}

/**
 * Convert a URL-safe Base64 string to a Uint8Array
 */
export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

/**
 * Convert an ArrayBuffer to a Base64-encoded string
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
