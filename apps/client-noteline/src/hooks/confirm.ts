'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { AUTH_URLS } from '@/data/constants';
import { PARAM_NAME } from '@repo/constants/names';
import { AuthAction } from '@repo/types/enums';
import { profileDelete } from '@repo/handlers/requests/database/profiles';
import { getUrlParam } from '@repo/utilities/url';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@repo/handlers/requests/auth';
import { useStoreSession } from '@/libraries/zustand/stores/session';

export type ConfirmStatus = {
  state: 'loading' | 'error' | 'success' | null;
  message?: string;
};

const initialMessages: Record<AuthAction, string> = {
  [AuthAction.SIGN_UP]: 'Click the button below to verify your email.',
  [AuthAction.SIGN_IN]:
    'Click the button below to access your personalized experience.',
};

/**
 * Hook to handle email confirmation (sign-up or sign-in)
 */
export const useConfirmEmail = (
  authAction: AuthAction,
  options?: { useRouterPush?: boolean }
) => {
  const router = useRouter();

  const [status, setStatus] = useState<ConfirmStatus>({
    state: null,
    message: initialMessages[authAction],
  });

  const handleConfirm = async () => {
    try {
      setStatus({
        state: 'loading',
        message: 'Please wait while we verify your email.',
      });

      const token = getUrlParam('token_hash');

      if (!token) {
        throw new Error('Missing token. Unable to verify your email.');
      }

      const type = getUrlParam('type');

      if (!type) {
        throw new Error('Missing type. Unable to verify your email.');
      }

      const redirect = getUrlParam(PARAM_NAME.REDIRECT) as string;
      const nextUrl = encodeURIComponent(
        redirect || AUTH_URLS.REDIRECT.DEFAULT
      );
      const redirectUrl = `${API_URL}/auth/callback/email?token_hash=${token}&type=${type}&next=${nextUrl}`;

      setStatus({
        state: 'success',
        message: 'Your email has been verified. Redirecting...',
      });

      if (options?.useRouterPush) {
        // router push keeps SPA navigation, but cookies set via HTTP-only headers will still work
        router.push(redirectUrl);
      } else {
        // full-page reload (safer for auth callbacks that set cookies)
        window.location.href = redirectUrl;
      }
    } catch (error) {
      setStatus({ state: 'error', message: (error as Error).message });
    }
  };

  return { status, handleConfirm };
};

export const useConfirmDeleteAccount = () => {
  const [status, setStatus] = useState<ConfirmStatus>({
    state: null,
    message: 'Click the button below to verify your session.',
  });

  const { session } = useStoreSession();

  const handleConfirm = async () => {
    try {
      if (!session) {
        throw new Error('No session found. Unable to delete account.');
      }

      setStatus({
        state: 'loading',
        message: 'Please wait while we verify your session.',
      });

      const response = await profileDelete(session.id);

      if (!response) throw new Error('No response from server');

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(
          result?.message || 'Failed to confirm account deletion'
        );
      }

      const result = await response.json();

      setStatus({ state: 'success', message: result.message });

      await signOut();
    } catch (error) {
      setStatus({ state: 'error', message: (error as Error).message });
    }
  };

  return { status, handleConfirm };
};
