/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { Variant } from '@repo/types/enums';
import { validators } from '@repo/utilities/validation';
import { contactAdd } from '@repo/handlers/requests/contact';
import { useFormBase } from '../form';
import { useNotification } from '@repo/hooks/notification';

export const useFormNewsletter = () => {
  const { showNotification } = useNotification();

  const { form, submitted, handleSubmit } = useFormBase<{ email: string }>(
    { email: '' },
    {
      email: (value) => validators.email(value.trim()),
    },
    {
      resetOnSuccess: true,
      onSubmit: async (rawValues) => {
        const cleanValues = { email: rawValues.email.trim().toLowerCase() };
        const response = await contactAdd(cleanValues);

        if (!response) throw new Error('No response from server');

        const result = await response.json();

        if (!response.ok) {
          if (result.exists) {
            showNotification({ variant: Variant.WARNING }, response, result);
          } else {
            throw new Error(result?.message || 'Subscription failed');
          }
        }

        return { response, result };
      },
      onError: (error) => {
        console.error('Newsletter error:', error);
      },
    }
  );

  return { form, submitted, handleSubmit };
};
