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
import { useRouter } from 'next/navigation';
import { AUTH_URLS } from '@/data/constants';
import { PARAM_NAME } from '@repo/constants/names';
import { useFormBase } from '@/hooks/form';

type FormValuesAuth = {
  email: string;
  remember: boolean;
};

export const useFormAuth = (params: { action: AuthAction }) => {
  const router = useRouter();

  const { form, submitted, handleSubmit } = useFormBase<FormValuesAuth>(
    { email: '', remember: false },
    {
      email: (value) => validators.email(value.trim()),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,

      onSubmit: async (rawValues) => {
        const response = await signIn({
          formData: {
            email: rawValues.email.trim().toLowerCase(),
          },
          options: {
            action: params.action,
            redirectUrl:
              (getUrlParam(PARAM_NAME.REDIRECT) as string) ||
              AUTH_URLS.REDIRECT.DEFAULT,
          },
        });

        if (!response.ok) throw new Error('Sign-in request failed');
        const result = await response.json();
        router.push(result.redirect);
      },
    }
  );

  return { form, submitted, handleSubmit };
};
