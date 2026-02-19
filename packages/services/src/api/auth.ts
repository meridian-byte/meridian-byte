'use server';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { createClient } from '@repo/libraries/supabase/server';
import { AuthAction } from '@repo/types/enums';
import { SignIn } from '@repo/types/auth';

type SignInReturn = {
  error?: string;
  message?: string;
};

export const signIn = async (params: SignIn): Promise<SignInReturn> => {
  try {
    const supabase = await createClient();

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: params.formData.email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: params.options?.action == AuthAction.SIGN_UP,
        // emailRedirectTo: `${params.options.baseUrl}${params.options?.redirectUrl || '/'}`,
      },
    });

    if (signInError) throw signInError;

    const message =
      params.options?.action == AuthAction.SIGN_UP
        ? "If the provided email is valid, you'll receive an email containing an OTP."
        : "If an account with the provided email exists, you'll receive an email containing an OTP.";

    return { message };
  } catch (error) {
    console.error(
      `---> event handler error (${params.options?.action}):`,
      error
    );

    if ((error as any).code == 'otp_disabled') {
      const error =
        'No account with the provided email exists, sign up instead';

      return { error };
    }

    return { error: (error as Error).message };
  }
};

export const signOut = async () => {
  try {
    const supabase = await createClient();
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
