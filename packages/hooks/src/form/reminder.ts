import { hasLength, UseFormReturnType } from '@mantine/form';
import { useReminderActions } from '../actions/reminder';
import { useFormBase } from '../form';
import { ReminderGet } from '@repo/types/models/reminder';

export type FormReminder = UseFormReturnType<
  Partial<ReminderGet>,
  (values: Partial<ReminderGet>) => Partial<ReminderGet>
>;

export const useFormReminder = (params?: {
  defaultValues?: Partial<ReminderGet>;
}) => {
  const { reminderCreate, reminderUpdate } = useReminderActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ReminderGet>>(
    {
      id: params?.defaultValues?.id || '',
    },
    {
      remind_at: hasLength({ min: 1, max: 24 }, 'Reminder time required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        if (!params?.defaultValues) {
          reminderCreate(rawValues);
        } else {
          reminderUpdate({
            ...params?.defaultValues,
            ...rawValues,
          } as ReminderGet);
        }
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
