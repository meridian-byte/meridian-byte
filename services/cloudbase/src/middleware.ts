import { PARAM_NAME } from '@repo/constants';
import { AUTH_URLS } from '@repo/constants';
import { validateRoute } from '@repo/utils';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/// <reference types="node" />

export const updateSession = async (
  request: NextRequest,
  response: NextResponse,
  baseUrl: string,
) => {
  const withPathname = request.nextUrl.pathname && !request.nextUrl.pathname.includes('undefined');

  if (!withPathname) return response;

  let supabaseResponse = response;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key');
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { redirectToAuth, redirectFromAuth, redirectToHome } = validateRoute({
    request,
    user,
    pathname: request.nextUrl.pathname,
  });

  if (redirectToHome) {
    const redirectUrl = new URL(baseUrl, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (redirectToAuth) {
    const redirectUrl = new URL(AUTH_URLS.SIGN_IN, request.url);
    redirectUrl.searchParams.set(PARAM_NAME.REDIRECT, request.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (redirectFromAuth) {
    const redirectUrl = new URL(baseUrl, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
};
