import { hasLength, UseFormReturnType } from '@mantine/form';
import { useEventActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { EventGet } from '@repo/types';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useAppshellChild } from '../appshell';

export type FormEventValues = {
  id: string;
  servings: EventGet[];
};

export type FormEvent = UseFormReturnType<Partial<FormEventValues>>;

export const useFormEvent = (params?: {
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

        if (params?.options?.closeWhenDone) {
          if (!!appshell) {
            if (appshell.child.aside == true) {
              handleToggleChildAside();
            }
          }
        }
      },
    },
  );

  // Watch allDay state and format start/end accordingly
  useEffect(() => {
    if (!form.values.start) return;

    if (form.values.allDay) {
      // Set to start of current selected day, and start of next day for the end
      const newStart = dayjs(form.values.start).format('YYYY-MM-DD 00:00:00');
      const newEnd = dayjs(form.values.start)
        .add(1, 'day')
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');

      form.setFieldValue('start', newStart as any);
      form.setFieldValue('end', newEnd as any);
    }
  }, [form.values.allDay]);

  return {
    form,
    submitted,
    handleSubmit,
  };
};
