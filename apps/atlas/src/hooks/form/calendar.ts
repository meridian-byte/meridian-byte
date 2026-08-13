import { hasLength, UseFormReturnType } from '@mantine/form';
import { useCalendarActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { CalendarGet } from '@repo/types';
import { useAppshellChild } from '../appshell';

export type FormCalendarValues = {
  id: string;
  servings: CalendarGet[];
};

export type FormCalendar = UseFormReturnType<Partial<FormCalendarValues>>;

export const useFormCalendar = (params?: {
  defaultValues?: Partial<CalendarGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { calendarCreate, calendarUpdate } = useCalendarActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<CalendarGet>>(
    {
      title: params?.defaultValues?.title || '',
      description: params?.defaultValues?.description || '',
    },
    {
      title: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters required'),
      description: hasLength({ max: 255 }, 'Maximum of 255 characters required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          calendarCreate({
            ...submitObject,
          });
        } else {
          calendarUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as CalendarGet);
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

  return {
    form,
    submitted,
    handleSubmit,
  };
};
