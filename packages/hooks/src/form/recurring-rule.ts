import { hasLength, UseFormReturnType } from '@mantine/form';
import { useRecurringRuleActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { Frequency, RecurringRuleGet } from '@repo/types';
import { useAppshellChild } from '../appshell';
import { useViewModal } from '@repo/store';

export type FormRecurringRuleValues = {
  id: string;
  servings: RecurringRuleGet[];
};

export type FormRecurringRule = UseFormReturnType<Partial<FormRecurringRuleValues>>;

export const useFormRecurringRule = (params?: {
  defaultValues?: Partial<RecurringRuleGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { recurringRuleCreate, recurringRuleUpdate } = useRecurringRuleActions();

  const { closeModalView } = useViewModal();

  const { form, submitted, handleSubmit } = useFormBase<Partial<RecurringRuleGet>>(
    {
      endDate: params?.defaultValues?.endDate || null,
      frequency: params?.defaultValues?.frequency || Frequency.WEEKLY,
      interval: params?.defaultValues?.interval || 1,
      months: params?.defaultValues?.months || [],
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
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          recurringRuleCreate({
            ...submitObject,
          });
        } else {
          recurringRuleUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as RecurringRuleGet);
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
