import { AUTH_URLS } from '@repo/constants/paths';
import { createClient } from '@repo/libraries/supabase/server';
import { profileCreate } from '../database/profile';
import { getEmailLocalPart } from '@repo/utilities/string';
import { linkify } from '@repo/utilities/url';
import { sharedUserHandle } from './shared';

export const authEmail = async (params: {
  searchParams: URLSearchParams;
  baseUrl: string | null;
}) => {
  const { searchParams, baseUrl } = params;

  const redirectUrl = searchParams.get('redirectUrl');
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  if (!email) throw new Error('Email is required');
  if (!otp) throw new Error('OTP is required');
  if (!baseUrl) throw new Error('Base url is required');

  const supabase = await createClient();

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
  const { profile, existed } = await profileCreate({
    id: session.user?.id || '',
    email: session.user?.email || '',
    first_name: nameFromEmail,
    user_name: linkify(session.user?.email || ''),
  });

  sharedUserHandle({ supabase, profile, existed });

  return `${baseUrl + `${redirectUrl || AUTH_URLS.REDIRECT}`}`;
};
