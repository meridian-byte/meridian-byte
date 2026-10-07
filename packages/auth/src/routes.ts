import {
  AUTH_URLS,
  authRoutes,
  COOKIE_NAME,
  getBaseUrl,
  ignoredAuthRoutes,
  ignoredRoutes,
  PARAM_NAME,
  protectedRoutes,
} from '@repo/constants';
import { NextResponse, type NextRequest } from 'next/server';
import { checkSession } from './shared';
import { getCookieServer } from '@repo/utils';

/**
 * Validates access for a given route based on user authentication state
 */
export const validateRouteAccess = async (request: NextRequest): Promise<NextResponse | null> => {
  const sessionCookie = await getCookieServer(COOKIE_NAME.AUTH.SESSION);

  const baseUrl = (await getBaseUrl()).ATLAS;
  const pathName = request.nextUrl.pathname;

  const actions = {
    redirectToAuth: false,
    redirectFromAuth: false,
    redirectToHome: false,
  };

  const handleAccessUnauthenticated = async () => {
    const isProtectedRoute = protectedRoutes.some((r) => {
      if (r === '/') {
        return pathName === '/';
      }

      return pathName === r || pathName.startsWith(r);
    });

    if (isProtectedRoute) {
      const isIgnoredRoute = ignoredRoutes.some((r) => pathName === r);

      if (!isIgnoredRoute) {
        const isAuthRoute = authRoutes.some((r) => pathName === r);

        if (!isAuthRoute) {
          actions.redirectToAuth = true;
        }
      }
    }
  };

  await checkSession(sessionCookie, {
    sessionMissing: async () => await handleAccessUnauthenticated(),

    sessionInvalid: async () => await handleAccessUnauthenticated(),

    sessionValid: async () => {
      const isIgnoredAuthRoute = ignoredAuthRoutes.some((r) => pathName === r);

      if (!isIgnoredAuthRoute) {
        const isAuthRoute = authRoutes.some((r) => pathName === r);
        if (isAuthRoute) actions.redirectFromAuth = true;
      }
    },
  });

  if (actions.redirectToHome) {
    const redirectUrl = new URL(baseUrl, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (actions.redirectToAuth) {
    const redirectUrl = new URL(AUTH_URLS.SIGN_IN, request.url);
    redirectUrl.searchParams.set(PARAM_NAME.REDIRECT, pathName);

    return NextResponse.redirect(redirectUrl);
  }

  if (actions.redirectFromAuth) {
    const redirectUrl = new URL(baseUrl, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return null;
};
