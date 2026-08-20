import { COMPANY_NAME } from '@repo/constants';
import { ProfileGet } from '@repo/types';
import { emailSendOnboarding, emailContactAdd } from '@repo/email';
import { isProduction } from '@repo/utils';

export const sharedUserHandle = async (props: {
  supabase: any;
  profile?: ProfileGet;
  existed: boolean;
}) => {
  const { supabase, profile, existed } = props;

  const name = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

  // update user
  const {
    data: { user: userData },
    error: updateError,
  } = await supabase.auth.updateUser({
    data: {
      name,
      full_name: name,
      avatar_url: profile?.avatar,
      userName: profile?.userName,
    },
  });

  if (updateError) throw updateError;

  if (isProduction()) {
    if (!existed && userData && userData.email) {
      await emailSendOnboarding({
        to: userData.email,
        userName: profile?.userName || userData.email,
        appName: COMPANY_NAME,
      });

      await emailContactAdd({ email: userData.email, name: userData.user_metadata.name }, false);
    }
  }
};
