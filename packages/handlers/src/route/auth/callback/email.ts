'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAME } from '@repo/constants';
import { AUTH_URLS } from '@repo/constants';
import { createClientcloudbaseServer } from '@repo/cloudbase';
import { profileCreateDb } from '@repo/handlers';
import { getEmailLocalPart, linkify } from '@repo/utils';
import { sharedUserHandle } from '@repo/auth';

export async function routeAuthCallbackEmail(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseUrl = searchParams.get('baseUrl');

  try {
    const redirect = await authEmail({ searchParams, baseUrl });

    const response = NextResponse.redirect(redirect);

    response.cookies.delete({
      name: COOKIE_NAME.AUTH.EMAIL,
      path: '/', // must match original path
    });

    return response;
  } catch (error) {
    console.error('---> route handler error (callback email):', error);

    return NextResponse.redirect(
      `${baseUrl + AUTH_URLS.ERROR}?error=${'Authentication Error'}&message=${encodeURIComponent((error as Error).message)}`,
    );
  }
}

const authEmail = async (params: { searchParams: URLSearchParams; baseUrl: string | null }) => {
  const { searchParams, baseUrl } = params;

  const redirectUrl = searchParams.get('redirectUrl');
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  if (!email) throw new Error('Email is required');
  if (!otp) throw new Error('OTP is required');
  if (!baseUrl) throw new Error('Base url is required');

  const supabase = await createClientcloudbaseServer();

  const { data: session, error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (verifyError) {
    if (verifyError.code == 'validation_failed') {
      return `${baseUrl + AUTH_URLS.ERROR}?error=${'Validation Failed'}&message=${verifyError.message}`;
    } else if (verifyError.code == 'otp_expired') {
      return `${baseUrl + AUTH_URLS.ERROR}?error=${'Invalid OTP'}&message=${verifyError.message}`;
    } else {
      throw `${baseUrl + AUTH_URLS.ERROR}?error=${'An Unexpected Error Occured'}&message=${verifyError.message}`;
    }
  }

  const nameFromEmail = getEmailLocalPart(session.user?.email || '');

  // create profile if doesn't exist
  const { profile, existed } = await profileCreateDb({
    id: session.user?.id || '',
    email: session.user?.email || '',
    firstName: nameFromEmail,
    userName: linkify(session.user?.email || ''),
  });

  await sharedUserHandle({ supabase, profile, existed });

  return `${baseUrl + `${redirectUrl || AUTH_URLS.REDIRECT}`}`;
};
