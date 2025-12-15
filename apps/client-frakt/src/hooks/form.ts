/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useState } from 'react';
import { FormValidateInput, useForm } from '@mantine/form';
import { useNetwork } from '@mantine/hooks';
import { Variant } from '@repo/types/enums';
import { useNotification } from '@repo/hooks/notification';
import IconNotification from '@repo/components/common/icons/notification';

type UseFormBaseOptions<TValues> = {
  /** Called with parsed values after validation passes */
  onSubmit: (
    values: TValues
  ) => Promise<{ response?: Response; result?: any } | void>;
  /** Optional close callback (eg. for modal) */
  close?: () => void;
  /** Reset form after successful submission */
  resetOnSuccess?: boolean;
  /** Hide success notification */
  hideSuccessNotification?: boolean;
  /** Called when an unexpected error occurs (e.g. fetch or runtime) */
  onError?: (error: Error) => void;

  clientOnly?: boolean;
};

export function useFormBase<TValues extends Record<string, any>>(
  initialValues: TValues,
  validate?: FormValidateInput<TValues>,
  options?: UseFormBaseOptions<TValues>
) {
  const [submitted, setSubmitted] = useState(false);
  const networkStatus = useNetwork();

  const form = useForm<TValues>({
    initialValues,
    validate,
  });

  const { showNotification } = useNotification();

  const handleSubmit = async () => {
    if (!form.isValid()) {
      showNotification({
        variant: Variant.WARNING,
        title: 'Form Invalid',
        desc: 'The form has one or more missing/incorrect fields.',
        icon: IconNotification({ variant: Variant.WARNING }),
      });
      return;
    }

    if (!options?.clientOnly && !networkStatus.online) {
      showNotification({
        variant: Variant.WARNING,
        title: 'Network Error',
        desc: 'Please check your internet connection.',
        icon: IconNotification({ variant: Variant.WARNING }),
      });
      return;
    }

    setSubmitted(true);
    try {
      const submit = await options?.onSubmit(form.values);

      if (options?.resetOnSuccess) form.reset();

      options?.close?.();

      if (!options?.hideSuccessNotification) {
        showNotification(
          {
            variant: Variant.SUCCESS,
            icon: IconNotification({ variant: Variant.SUCCESS }),
          },
          submit?.response,
          submit?.result
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error occurred';

      showNotification({
        variant: Variant.FAILED,
        desc: message,
        icon: IconNotification({ variant: Variant.FAILED }),
      });

      options?.onError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setSubmitted(false);
    }
  };

  return {
    form,
    submitted,
    handleSubmit,
    reset: form.reset,
    validate: form.validate,
  };
}
