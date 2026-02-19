'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { validators } from '@repo/utilities/validation';
import { signIn } from '@repo/handlers/requests/auth';
import { AuthAction } from '@repo/types/enums';
import { getUrlParam } from '@repo/utilities/url';
import { AUTH_URLS } from '@repo/constants/paths';
import { COOKIE_NAME, PARAM_NAME } from '@repo/constants/names';
import { useFormBase } from '../../form';
import { useEffect, useState } from 'react';
import { API_URL } from '@repo/constants/paths';
import {
  getCookieClient,
  setCookieClient,
} from '@repo/utilities/cookie-client';
import { WEEK } from '@repo/constants/sizes';

type FormValuesAuth = {
  email: string;
  remember: boolean;
  otp?: string;
};

export const useFormAuth = (params: {
  action: AuthAction;
  baseUrl: string;
}) => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [resent, setResent] = useState(false);

  const { form, submitted, handleSubmit } = useFormBase<FormValuesAuth>(
    { email: '', otp: '', remember: false },
    { email: (value) => validators.email(value.trim()) },
    {
      resetOnSuccess: false,
      hideSuccessNotification: true,

      onSubmit: async (rawValues, options) => {
        const email = rawValues.email.trim().toLowerCase();
        const otp = rawValues.otp?.trim();

        if (email && message && !options?.resent && otp?.length != 8) {
          form.setErrors({ otp: 'Invalid OTP' });
          return;
        }

        if (!otp || options?.resent) {
          setError(undefined);

          const response = await signIn({
            formData: { email },
            options: { action: params.action },
          });
          const result = await response.json();
          if (result.data.error) {
            setError(result.data.error);
          } else {
            setMessage(result.data.message);
            setCookieClient(COOKIE_NAME.AUTH.EMAIL, email, {
              expiryInSeconds: WEEK,
            });
          }
          if (options?.resent) setResent(false);
        } else {
          const redirect =
            (getUrlParam(PARAM_NAME.REDIRECT) as string) ||
            AUTH_URLS.REDIRECT.DEFAULT;
          const redirectUrl = encodeURIComponent(redirect);
          const callbackUrl = `${API_URL}/auth/callback/email?email=${email}&otp=${otp}&redirectUrl=${redirectUrl}&baseUrl=${params.baseUrl}`;
          window.location.href = callbackUrl;
        }
      },
    }
  );

  useEffect(() => {
    const savedEmail = getCookieClient(COOKIE_NAME.AUTH.EMAIL);

    if (savedEmail) {
      form.setFieldValue('email', savedEmail);
      setMessage('Check your email for an OTP');
    }
  }, []);

  return {
    form,
    submitted,
    handleSubmit,
    message,
    setMessage,
    error,
    setError,
    resent,
    setResent,
  };
};
