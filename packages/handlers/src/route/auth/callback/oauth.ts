'use server';

import { NextResponse } from 'next/server';
import { createClientcloudbaseServer } from '@repo/cloudbase';
import { profileCreate } from '@repo/handlers';
import { segmentFullName, linkify } from '@repo/utils';
import { API_URL, AUTH_URLS, BASE_URL } from '@repo/constants';
import { sharedUserHandle } from '@repo/auth';

export async function routeAuthCallbackOauth(request: Request) {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    const { searchParams } = new URL(request.url);

    const { next } = await authOauth({ searchParams });

    return NextResponse.redirect(`${baseUrl}${next}`);
  } catch (error) {
    return NextResponse.redirect(
      `${baseUrl + AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
    );
  }
}

const authOauth = async (params: { searchParams: URLSearchParams }) => {
  const { searchParams } = params;

  const code = searchParams.get('code');

  if (!code) {
    throw new Error('The link is broken');
  }

  const supabase = await createClientcloudbaseServer();

  const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) throw exchangeError;

  const nameSegments = segmentFullName(data.user.user_metadata.name || '');

  // create profile if doesn't exist
  const { items } = await profileCreate(API_URL, {
    id: data.user?.id,
    firstName: nameSegments.first,
    lastName: nameSegments.last,
    userName: linkify(data.user.email || ''),
    email: data.user.email || '',
    avatar: data.user.user_metadata.avatar_url || '',
  });

  const { profile, existed } = items;

  await sharedUserHandle({ supabase, profile: profile, existed: existed });

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? AUTH_URLS.REDIRECT.DEFAULT;

  return { next };
};
