/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextRequest, NextResponse } from 'next/server';

type DynamicRedirectMap = {
  pattern: RegExp;
  replacement: string;
}[];

type StaticRedirectMap = {
  [key: string]: string;
};

type RedirectOptions = {
  permanent?: boolean; // 301 vs 307
  preserveQuery?: boolean;
  preserveHash?: boolean;
};

/**
 * -------------------------------
 * Redirect Handler
 * -------------------------------
 * Handles both static and dynamic redirects in Next.js middleware.
 */
export const createRedirectHandler = (
  staticRedirects: StaticRedirectMap = {},
  dynamicRedirects: DynamicRedirectMap = [],
  options: RedirectOptions = {}
) => {
  const {
    permanent = true,
    preserveQuery = true,
    preserveHash = true,
  } = options;

  return function handleRedirect(request: NextRequest): NextResponse | null {
    const url = new URL(request.url);
    const path = url.pathname;

    const appendQueryAndHash = (targetUrl: URL) => {
      if (preserveQuery) {
        url.searchParams.forEach((value, key) => {
          targetUrl.searchParams.append(key, value);
        });
      }
      if (preserveHash && url.hash) {
        targetUrl.hash = url.hash;
      }
    };

    // 1️⃣ Check static redirects
    if (path in staticRedirects) {
      const newUrl = new URL(staticRedirects[path], url.origin);
      appendQueryAndHash(newUrl);

      return NextResponse.redirect(newUrl, {
        status: permanent ? 301 : 307,
      });
    }

    // 2️⃣ Check dynamic redirects
    for (const { pattern, replacement } of dynamicRedirects) {
      if (pattern.test(path)) {
        const newPath = path.replace(pattern, replacement);
        const newUrl = new URL(newPath, url.origin);
        appendQueryAndHash(newUrl);

        return NextResponse.redirect(newUrl, {
          status: permanent ? 301 : 307,
        });
      }
    }

    return null; // No redirect matched
  };
};

/**
 * -------------------------------
 * CORS Middleware Helper
 * -------------------------------
 * Sets CORS headers for allowed origins.
 */
export const setCorsHeaders = (params: {
  crossOrigins: string[];
  request: NextRequest;
  response: NextResponse;
}) => {
  const origin = params.request.headers.get('origin') || '';

  if (params.crossOrigins.some((allowed) => origin.includes(allowed))) {
    const { response } = params;

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,DELETE,PATCH,POST,PUT,OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      [
        'X-CSRF-Token',
        'X-Requested-With',
        'Accept',
        'Accept-Version',
        'Content-Length',
        'Content-MD5',
        'Content-Type',
        'Authorization',
        'Date',
        'X-Api-Version',
        'Access-Control-Allow-Origin',
      ].join(', ')
    );
  }
};

/**
 * -------------------------------
 * Additional Middleware Helpers
 * -------------------------------
 */

/**
 * Generate a NextResponse JSON with optional CORS headers
 */
export const jsonResponse = (
  data: any,
  request: NextRequest,
  options?: { status?: number; crossOrigins?: string[] }
) => {
  const response = NextResponse.json(data, { status: options?.status ?? 200 });
  if (options?.crossOrigins) {
    setCorsHeaders({ crossOrigins: options.crossOrigins, request, response });
  }
  return response;
};

/**
 * Middleware helper to redirect if a condition is met
 */
export const conditionalRedirect = (
  condition: boolean,
  target: string,
  request: NextRequest,
  options?: RedirectOptions
): NextResponse | null => {
  if (!condition) return null;

  const url = new URL(target, request.url);
  return NextResponse.redirect(url, {
    status: options?.permanent ? 301 : 307,
  });
};
