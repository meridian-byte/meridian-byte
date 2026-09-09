'use server';

import { createClientcloudbaseServer } from '@repo/cloudbase';
import { AuthAction, SignIn } from '@repo/types';

type SignInReturn = {
  error?: string;
  message?: string;
};

export const signIn = async (params: SignIn): Promise<SignInReturn> => {
  try {
    const supabase = await createClientcloudbaseServer();

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: params.formData.email,
      options: {
        // // set this to false if you do not want the user to be automatically signed up
        // shouldCreateUser: params.options?.action == AuthAction.SIGN_UP,
        shouldCreateUser: true,
        // emailRedirectTo: `${params.options.baseUrl}${params.options?.redirectUrl || '/'}`,
      },
    });

    if (signInError) throw signInError;

    // const message =
    //   params.options?.action == AuthAction.SIGN_UP
    //     ? "If the provided email is valid, you'll receive an email containing an OTP."
    //     : "If an account with the provided email exists, you'll receive an email containing an OTP.";
    const message = "If the provided email is valid, you'll receive an email containing an OTP.";

    return { message };
  } catch (error) {
    console.error(`---> event handler error (${params.options?.action}):`, error);

    if ((error as any).code == 'otp_disabled') {
      const error = 'No account with the provided email exists, sign up instead';

      return { error };
    }

    return { error: (error as Error).message };
  }
};

export const signOut = async () => {
  try {
    const supabase = await createClientcloudbaseServer();
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;

    return { message: 'Signed Out' };
  } catch (error) {
    console.error('---> event handler error (sign out):', error);

    return {
      error: (error as Error).message,
    };
  }
};
