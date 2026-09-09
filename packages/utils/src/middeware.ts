/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { COOKIE_NAME, SHARED_VERCEL_SUBSTRING } from '@repo/constants';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants';
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
  options: RedirectOptions = {},
) => {
  const { permanent = true, preserveQuery = true, preserveHash = true } = options;

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
    const redirectTarget = staticRedirects[path];

    if (path in staticRedirects && redirectTarget) {
      const newUrl = new URL(redirectTarget, url.origin);
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
export const isAllowedOrigin = (origin: string): boolean => {
  if (!origin) return false;

  try {
    const { hostname, protocol } = new URL(origin);

    // 1. Allow local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }

    // 2. Allow HTTPS requests to production domain or its subdomains
    const productionDomain = process.env.NEXT_PUBLIC_HOST_WEB_PROD;

    if (!productionDomain) {
      console.error('x--> (CORS error) Production domain required.');
      return false;
    }

    if (
      protocol === 'https:' &&
      (hostname === productionDomain || hostname.endsWith(`.${productionDomain}`))
    ) {
      return true;
    }

    // 3. Allow Vercel preview deployments for meridianbyte projects
    const vercelPreviewRegex = new RegExp(`^${SHARED_VERCEL_SUBSTRING}-[a-z0-9-]+\\.vercel\\.app$`);

    if (protocol === 'https:' && vercelPreviewRegex.test(hostname)) {
      return true;
    }

    return false;
  } catch {
    return false; // Invalid URL structure
  }
};

export const setCorsHeaders = (params: { request: NextRequest; response: NextResponse }) => {
  const origin = params.request.headers.get('origin') || '';

  if (isAllowedOrigin(origin)) {
    const { response } = params;

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
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
      ].join(', '),
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
export const jsonResponse = (data: any, request: NextRequest, options?: { status?: number }) => {
  const response = NextResponse.json(data, { status: options?.status ?? 200 });
  setCorsHeaders({ request, response });
  return response;
};

/**
 * Middleware helper to redirect if a condition is met
 */
export const conditionalRedirect = (
  condition: boolean,
  target: string,
  request: NextRequest,
  options?: RedirectOptions,
): NextResponse | null => {
  if (!condition) return null;

  const url = new URL(target, request.url);
  return NextResponse.redirect(url, {
    status: options?.permanent ? 301 : 307,
  });
};

export const getColorScheme = (request: NextRequest, response: NextResponse) => {
  const themeState = request.cookies.get(COOKIE_NAME.COLOR_SCHEME)?.value || DEFAULT_COLOR_SCHEME;

  // 1. Check if we already have a calculated theme cookie
  const existingTheme = request.cookies.get(COOKIE_NAME.COLOR_SCHEME)?.value;

  let themeToSet = themeState;

  if (themeState === DEFAULT_COLOR_SCHEME) {
    const preferredScheme = request.headers.get('sec-ch-prefers-color-scheme');

    if (preferredScheme) {
      // We have a hint! Use it.
      themeToSet = preferredScheme === 'dark' ? 'dark' : 'light';
    } else if (existingTheme) {
      // No hint this time (Request 3), but we already have a value from Request 2.
      // KEEP the existing value instead of defaulting to light.
      themeToSet = existingTheme;
    } else {
      // Truly first visit, no hint, no existing cookie. Default to light.
      themeToSet = DEFAULT_COLOR_SCHEME;
    }
  }

  // 2. Only set the cookie if it's actually changing or missing
  if (existingTheme !== themeToSet) {
    response.cookies.set(COOKIE_NAME.COLOR_SCHEME, themeToSet, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
    });
  }

  return response;
};
