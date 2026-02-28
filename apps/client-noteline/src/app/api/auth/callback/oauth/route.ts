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
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    const { searchParams } = new URL(request.url);

    const { next } = await authOauth({ searchParams });

    return NextResponse.redirect(`${baseUrl}${next}`);
  } catch (error) {
    return NextResponse.redirect(
      `${baseUrl + AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
