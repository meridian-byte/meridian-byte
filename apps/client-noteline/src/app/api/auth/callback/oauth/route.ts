/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextResponse } from 'next/server';
import { AUTH_URLS } from '@repo/constants/paths';
import { authOauth } from '@repo/services/auth/oauth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);

    const { next, forwardedHost, isLocalEnv } = await authOauth({
      request,
      searchParams,
    });

    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (error) {
    return NextResponse.redirect(
      `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
