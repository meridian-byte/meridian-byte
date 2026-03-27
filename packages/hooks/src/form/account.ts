import { hasLength } from '@mantine/form';
import { useAccountActions } from '../actions/account';
import { useFormBase } from '../form';
import { AccountGet } from '@repo/types/models/account';
import { useStoreAccountGroup } from '@repo/libraries/zustand/stores/account-group';
import { AccountType } from '@repo/types/models/enums';

export const useFormAccount = (params?: {
  defaultValues?: Partial<AccountGet>;
}) => {
  const { accountCreate, accountUpdate } = useAccountActions();
  const accountGroups = useStoreAccountGroup((s) => s.accountGroups);

  const { form, submitted, handleSubmit } = useFormBase<Partial<AccountGet>>(
    {
      group_id: params?.defaultValues?.group_id || '',
      type: (params?.defaultValues?.type || AccountType.ASSET) as any,
      name: params?.defaultValues?.name || '',
      currency: params?.defaultValues?.currency || '',
      currency_code: params?.defaultValues?.currency_code || '',
      description: params?.defaultValues?.description || '',
      balance: (params?.defaultValues?.balance || '') as any,
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
        const submitObject = {
          ...rawValues,
          currency: currencies[0]?.currency || '',
          currency_code: currencies[0]?.currency_code || '',
        };

        if (!params?.defaultValues) {
          accountCreate({
            ...submitObject,
            balance: Number(submitObject.balance).toFixed(2) as any,
          });
        } else {
          accountUpdate({
            ...params?.defaultValues,
            ...submitObject,
            balance: Number(submitObject.balance).toFixed(2) as any,
          } as AccountGet);
        }
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
    accountGroups,
  };
};

const currencies = [
  {
    currency: 'Kenyan Shilling',
    currency_code: 'KES',
  },
  {
    currency: 'US Dollar',
    currency_code: 'USD',
  },
  {
    currency: 'British Pound',
    currency_code: 'GPB',
  },
];
