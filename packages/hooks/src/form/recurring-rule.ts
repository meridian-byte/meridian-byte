import { hasLength, UseFormReturnType } from '@mantine/form';
import { useRecurringRuleActions } from '../actions/recurring-rule';
import { useFormBase } from '../form';
import { RecurringRuleGet } from '@repo/types/models/recurring-rule';

export type FormRecurringRule = UseFormReturnType<
  Partial<RecurringRuleGet>,
  (values: Partial<RecurringRuleGet>) => Partial<RecurringRuleGet>
>;

export const useFormRecurringRule = (params?: {
  defaultValues?: Partial<RecurringRuleGet>;
}) => {
  const { recurringRuleCreate, recurringRuleUpdate } =
    useRecurringRuleActions();

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<RecurringRuleGet>
  >(
    {
      id: params?.defaultValues?.id || '',
      weekdays: params?.defaultValues?.weekdays || [],
    },
    {
      frequency: hasLength({ min: 1 }, 'Frequency required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        if (!params?.defaultValues?.updated_at) {
          recurringRuleCreate(rawValues);
        } else {
          recurringRuleUpdate({
            ...params?.defaultValues,
            ...rawValues,
          } as RecurringRuleGet);
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
