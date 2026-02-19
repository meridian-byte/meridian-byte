import { hasLength } from '@mantine/form';
import { useAccountGroupActions } from '../actions/account-group';
import { useFormBase } from '../form';
import { AccountGroupGet } from '@repo/types/models/account-group';

export const useFormAccountGroup = (params?: {
  defaultValues?: Partial<AccountGroupGet>;
}) => {
  const { accountGroupCreate, accountGroupUpdate } = useAccountGroupActions();

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<AccountGroupGet>
  >(
    {
      name: params?.defaultValues?.name || '',
    },
    {
      name: hasLength(
        { min: 2, max: 24 },
        'Between 2 and 24 characters required'
      ),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        if (!params?.defaultValues) {
          accountGroupCreate(rawValues);
        } else {
          accountGroupUpdate({
            ...params?.defaultValues,
            ...rawValues,
          } as AccountGroupGet);
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
