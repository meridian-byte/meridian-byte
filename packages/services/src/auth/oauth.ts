import { createClient } from '@repo/libraries/supabase/server';
import { profileCreate } from '@repo/services/database/profile';
import { segmentFullName } from '@repo/utilities/string';
import { AUTH_URLS } from '@repo/constants/paths';
import { emailSendOnboarding } from '@repo/libraries/wrappers/email';
import { emailContactAdd } from '@repo/services/api/email/contacts';
import { COMPANY_NAME } from '@repo/constants/app';

export const authOauth = async (params: { searchParams: URLSearchParams }) => {
  const { searchParams } = params;

  const code = searchParams.get('code');

  if (!code) {
    throw new Error('The link is broken');
  }

  const supabase = await createClient();

  const { error: exchangeError, data } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) throw exchangeError;

  // create profile if doesn't exist
  const { profile, existed } = await profileCreate({
    id: data.user?.id,
    first_name: segmentFullName(data.user.user_metadata.name || '').first,
    last_name: segmentFullName(data.user.user_metadata.name || '').last,
    phone: data.user.phone || '',
    avatar: data.user.user_metadata.avatar_url || '',
  });

  const name =
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();

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

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? AUTH_URLS.REDIRECT.DEFAULT;

  return { next };
};
