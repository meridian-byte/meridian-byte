import { AUTH_URLS } from '@repo/constants/paths';
import { createClient } from '@repo/libraries/supabase/server';
import { profileCreate } from '../database/profile';
import { getEmailLocalPart, segmentFullName } from '@repo/utilities/string';
import { emailSendOnboarding } from '@repo/libraries/wrappers/email';
import { emailContactAdd } from '../api/email/contacts';
import { COMPANY_NAME } from '@repo/constants/app';

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

  // create profile if doesn't exist
  const { profile, existed } = await profileCreate({
    id: session.user?.id || '',
    first_name: getEmailLocalPart(session.user?.email || ''),
  });

  const name = `${profile?.first_name} ${profile?.last_name || ''}`.trim();

  // update user
  const {
    data: { user: userData },
    error: updateError,
  } = await supabase.auth.updateUser({
    data: {
      name,
      full_name: name,
      picture: profile?.avatar,
      avatar_url: profile?.avatar,
      userName: profile?.user_name,
    },
  });

  if (updateError) throw updateError;

  if (!existed && userData && userData.email) {
    await emailSendOnboarding({
      to: userData.email,
      userName:
        segmentFullName(userData?.user_metadata.name).first || userData.email,
      appName: COMPANY_NAME,
    });

    await emailContactAdd(
      { email: userData.email, name: userData.user_metadata.name },
      false
    );
  }

  return `${baseUrl + `${redirectUrl || AUTH_URLS.REDIRECT}`}`;
};
