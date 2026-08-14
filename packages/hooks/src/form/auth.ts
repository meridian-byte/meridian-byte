'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { validators } from '@repo/utils';
import { signIn } from '@repo/handlers';
import { AuthAction } from '@repo/types';
import { COOKIE_NAME } from '@repo/constants';
import { useFormBase } from '../form';
import { useEffect, useState } from 'react';
import { getCookieClient, setCookieClient } from '@repo/utils';
import { WEEK } from '@repo/constants';

type FormValuesAuth = {
  email: string;
  remember: boolean;
  otp?: string;
};

export const useFormAuth = (params: { action: AuthAction; baseUrl: string }) => {
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

        if (!otp || options?.resent) {
          setError(undefined);

          const response = await signIn({
            formData: { email },
            options: { action: params.action },
            apiUrl: `${params.baseUrl}/api`,
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
        }
      },
    },
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
