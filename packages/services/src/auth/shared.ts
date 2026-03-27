import { COMPANY_NAME } from '@repo/constants/app';
import { emailSendOnboarding } from '@repo/libraries/wrappers/email';
import { ProfileGet } from '@repo/types/models/profile';
import { emailContactAdd } from '../api/email/contacts';

export const sharedUserHandle = async (props: {
  supabase: any;
  profile?: ProfileGet;
  existed: boolean;
}) => {
  const { supabase, profile, existed } = props;

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
      avatar_url: profile?.avatar,
      user_name: profile?.user_name,
    },
  });

  if (updateError) throw updateError;

  if (!existed && userData && userData.email) {
    await emailSendOnboarding({
      to: userData.email,
      userName: profile?.user_name || userData.email,
      appName: COMPANY_NAME,
    });

    await emailContactAdd(
      { email: userData.email, name: userData.user_metadata.name },
      false
    );
  }
};
