/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_URLS } from '@repo/constants/paths';
import { authEmail } from '@repo/services/auth/email';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseUrl = searchParams.get('baseUrl');

  try {
    const redirect = await authEmail({ searchParams, baseUrl });

    return NextResponse.redirect(redirect);
  } catch (error) {
    console.error('---> route handler error (callback email):', error);

    return NextResponse.redirect(
      `${baseUrl + AUTH_URLS.ERROR}?error=${'Authentication Error'}&message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
