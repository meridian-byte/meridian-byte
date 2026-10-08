'use client';

import { getFromLocalStorage, getUrlParam, isProduction, validators } from '@repo/utils';
import { signIn, signInCallback } from '@repo/handlers';
import { AuthAction, SessionCookie } from '@repo/types';
import {
  AUTH_URLS,
  COOKIE_NAME,
  STORAGE_NAME,
  PARAM_NAME,
  SECONDS_HOUR,
  SECONDS_MINUTE,
} from '@repo/constants';
import { useEffect, useState } from 'react';
import { getCookieClient, setCookieClient } from '@repo/utils';
import { useForm } from '@mantine/form';
import { useStoreWorkspace } from '@repo/store';

export const useFormAuth = (params: { action: AuthAction; baseUrl: string }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [display, setDisplay] = useState<{ error?: string; message?: string } | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const form = useForm({ initialValues: { email: '', otp: '' } });

  const workspaces = useStoreWorkspace((s) => s.workspaces);

  const submitOps = {
    submitEmail: async (values: typeof form.values, options?: { resend?: boolean }) => {
      if (submitted) return;
      if (display) setDisplay(null);

      if (options?.resend) {
        let loginCookie: SessionCookie | null = getCookieClient(COOKIE_NAME.AUTH.LOGIN);

        if (loginCookie && new Date(loginCookie.updatedAt)) {
          // get 1 min from previous OTP request
          const nextMinute = new Date(
            new Date(loginCookie.updatedAt).getTime() + 1 * SECONDS_MINUTE * 1000,
          );

          if (new Date() < nextMinute) {
            setDisplay({ error: 'You can request code again after 1 minute.' });
            return;
          }
        }
      }

      if (step != 'email') setStep('email');

      if (options?.resend) {
        if (values.otp) form.setFieldValue('otp', '');
      }

      // manual validate
      if (!!validators.email(values.email.trim())) {
        form.setFieldError('email', true);
        setDisplay({ error: 'Invalid email format.' });
        return;
      }

      setSubmitted(true);

      const localSession = getFromLocalStorage(STORAGE_NAME.AUTH.SESSION);

      setCookieClient(COOKIE_NAME.AUTH.EMAIL, values.email, {
        expiryInSeconds: SECONDS_HOUR,
        secure: isProduction(),
        sameSite: 'Lax',
      });

      setCookieClient(COOKIE_NAME.AUTH.LOGIN, localSession, {
        expiryInSeconds: SECONDS_HOUR,
        secure: isProduction(),
        sameSite: 'Lax',
      });

      const response = await signIn(
        {
          values,
          options: { action: params.action },
        },
        `${params.baseUrl}/api`,
      );

      const data = await response.json();

      setDisplay({ ...data });

      if (!data.error) {
        // all well. otp sent to email. proceed to otp step.
        setStep('otp');
      }

      setSubmitted(false);
    },

    submitOtp: async (values: typeof form.values) => {
      if (submitted) return;
      if (display) setDisplay(null);

      // manual validate
      if (values.otp.length != 8) {
        form.setFieldError('otp', true);
        setDisplay({ error: 'OTP must be exactly 8 characters long.' });
        return;
      }

      setSubmitted(true);

      const loginCookie = getCookieClient(COOKIE_NAME.AUTH.LOGIN);

      if (!loginCookie) {
        // login cooke shouldn't be missing if otp has already been sent
        setDisplay({ error: 'An unexpected error occured.' });
        setSubmitted(false);
      } else {
        const redirect = getUrlParam(PARAM_NAME.REDIRECT) || AUTH_URLS.REDIRECT.DEFAULT;
        const redirectUrl = encodeURIComponent(redirect as string);

        const response = await signInCallback(
          {
            values,
            appData: { workspaces: workspaces || undefined },
            options: { action: params.action },
          },
          `${params.baseUrl}/api`,
          redirectUrl,
          params.baseUrl,
        );

        const data = await response.json();

        setDisplay({ ...data });

        if (data.error) {
          form.setFieldValue('otp', '');
          setSubmitted(false);
        } else {
          // redirect after auth
          window.location.href = decodeURIComponent(redirectUrl);
        }
      }
    },
  };

  useEffect(() => {
    const savedEmail = getCookieClient(COOKIE_NAME.AUTH.EMAIL);

    if (savedEmail) {
      form.setFieldValue('email', savedEmail);

      if (step == 'otp') {
        setDisplay({ message: 'Check your email for an OTP' });
      }
    }
  }, []);

  return {
    form,
    submitted,
    submitOps,
    step,
    display,
    setDisplay,
  };
};
