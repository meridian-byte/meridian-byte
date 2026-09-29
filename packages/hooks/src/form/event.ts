import { hasLength, UseFormReturnType } from '@mantine/form';
import { useEventActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { EventGet } from '@repo/types';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useAppshellChild } from '../appshell';
import { useDebouncedCallback } from '@mantine/hooks';

export type FormEventValues = {
  id: string;
  servings: EventGet[];
};

export type FormEvent = UseFormReturnType<Partial<FormEventValues>>;

export const useFormEvent = (params?: {
  modal?: boolean;
  defaultValues?: Partial<EventGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { eventCreate, eventUpdate } = useEventActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<EventGet>>(
    {
      title: params?.defaultValues?.title || '',
      description: params?.defaultValues?.description || '',
      start: (params?.defaultValues?.start || new Date().toISOString()) as any,
      end: (params?.defaultValues?.end || new Date().toISOString()) as any,
      calendarId: params?.defaultValues?.calendarId || '',
      location: params?.defaultValues?.location || '',
      allDay: params?.defaultValues?.allDay ?? false,
    },
    {
      title: hasLength({ min: 2, max: 128 }, 'Between 2 and 128 characters required'),
      description: hasLength({ max: 255 }, 'Maximum of 255 characters required'),
      location: hasLength({ max: 255 }, 'Maximum of 255 characters required'),
    },
    {
      resetOnSuccess: params?.defaultValues?.updatedAt ? false : true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          eventCreate({
            ...submitObject,
          });
        } else {
          eventUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as EventGet);
        }

        if (!params?.modal && params?.options?.closeWhenDone) {
          if (!!appshell) {
            if (appshell.child.aside == true) {
              handleToggleChildAside();
            }
          }
        }
      },
    },
  );

  const handleUpdate = useDebouncedCallback(() => {
    eventUpdate({
      ...params?.defaultValues,
      ...form.values,
    } as EventGet);
  }, 500);

  // update state when values change
  useEffect(() => {
    if (!form.isDirty()) return;
    if (!params?.defaultValues?.updatedAt) return;
    if (JSON.stringify(form.values) == JSON.stringify(params.defaultValues)) return;

    handleUpdate();
  }, [form.values]);

  return {
    form,
    submitted,
    handleSubmit,
  };
};
