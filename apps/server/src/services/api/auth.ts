'use server';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { createClient } from '@/libraries/supabase/server';
import { AUTH_URLS, BASE_URL_CLIENT } from '@/data/constants';
import { AuthAction } from '@repo/types/enums';
import { SignIn, SignUp } from '@repo/types/auth';

export const signIn = async (params: SignIn) => {
  try {
    const supabase = await createClient();

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: params.formData.email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: params.options?.action == AuthAction.SIGN_UP,
        emailRedirectTo: `${BASE_URL_CLIENT}${params.options?.redirectUrl || AUTH_URLS.REDIRECT.DEFAULT}`,
      },
    });

    if (signInError) throw signInError;

    const message =
      params.options?.action == AuthAction.SIGN_UP
        ? "If the provided email is valid, you'll receive an email confirmation link"
        : "If an account with the provided email exists, you'll receive a sign in magic link.";

    return {
      redirect: `${AUTH_URLS.CHECK_EMAIL}?message=${encodeURIComponent(message)}`,
    };
  } catch (error) {
    console.error(
      `---> event handler error (${params.options?.action}):`,
      error
    );

    if ((error as any).code == 'otp_disabled') {
      const message =
        'No account with the provided email exists, sign up instead';

      return {
        redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent(message)}`,
      };
    }

    return {
      redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
    };
  }
};

export const signUp = async (formData: SignUp) => {
  try {
    const supabase = await createClient();
    const { error: signUpError } = await supabase.auth.signUp(formData);

    if (signUpError) throw signUpError;

    return { redirect: AUTH_URLS.CHECK_EMAIL };
  } catch (error) {
    console.error('---> event handler error (sign up):', error);
    return {
      redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
    };
  }
};

export const signOut = async () => {
  try {
    const supabase = await createClient();
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
  } catch (error) {
    console.error('---> event handler error (sign out):', error);
    return {
      redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
    };
  }
};
