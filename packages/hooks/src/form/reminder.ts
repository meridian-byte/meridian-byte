import { hasLength, UseFormReturnType } from '@mantine/form';
import { useReminderActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { ReminderGet } from '@repo/types';
import { useAppshellChild } from '../appshell';
import { useViewModal } from '@repo/store';

export type FormReminderValues = {
  id: string;
  servings: ReminderGet[];
};

export type FormReminder = UseFormReturnType<Partial<FormReminderValues>>;

export const useFormReminder = (params?: {
  defaultValues?: Partial<ReminderGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { reminderCreate, reminderUpdate } = useReminderActions();

  const { closeModalView } = useViewModal();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ReminderGet>>(
    {
      remindAt: params?.defaultValues?.remindAt || new Date(),
      sent: params?.defaultValues?.sent ?? false,
      taskId: params?.defaultValues?.taskId || '',
    },
    {
      remindAt: hasLength({ min: 1 }, 'Reminder time required'),
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
          reminderCreate({
            ...submitObject,
          });
        } else {
          reminderUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ReminderGet);
        }

        if (!params?.defaultValues?.updatedAt) {
          if (params?.options?.closeWhenDone) {
            if (!!appshell) {
              if (appshell.child.aside == true) {
                handleToggleChildAside();
              }
            }
          }
        } else {
          closeModalView();
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
