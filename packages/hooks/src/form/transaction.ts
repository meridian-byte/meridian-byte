import { hasLength } from '@mantine/form';
import { useTransactionActions } from '../actions/transaction';
import { useFormBase } from '../form';
import { TransactionGet } from '@repo/types/models/transaction';
import { CategoryType, TransactionType } from '@repo/types/models/enums';
import { useStoreAccount } from '@repo/libraries/zustand/stores/account';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useEffect, useState } from 'react';

export const useFormTransaction = (params?: {
  defaultValues?: Partial<TransactionGet>;
}) => {
  const { transactionCreate, transactionUpdate } = useTransactionActions();
  const categories = useStoreCategory((s) => s.categories);
  const accounts = useStoreAccount((s) => s.accounts);

  const [accountId2, setaccountId2] = useState('');

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<TransactionGet>
  >(
    {
      type: (params?.defaultValues?.type || TransactionType.DEBIT) as any,
      amount: (params?.defaultValues?.amount || '') as any,
      fees: (params?.defaultValues?.fees || '') as any,
      created_at: (params?.defaultValues?.created_at || '') as any,
      category_id: params?.defaultValues?.category_id || '',
      account_id: params?.defaultValues?.account_id || '',
      recurring_rule_id: params?.defaultValues?.recurring_rule_id || '',
      description: params?.defaultValues?.description || '',
    },
    {
      type: hasLength({ min: 1 }, 'Transaction Type is Required'),
      amount: (value) =>
        Number(value) > 0 ? undefined : 'Transaction amount required',
      category_id: (value, values) =>
        values.type != TransactionType.DEBIT
          ? undefined
          : value && value.length < 1
            ? 'Category is Required'
            : undefined,
      account_id: hasLength({ min: 1 }, 'Account is Required'),
      description: hasLength({ max: 255 }, 'Maximum 255 characters allowed'),
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

        if (!params?.defaultValues?.updated_at) {
          const now = new Date(rawValues.created_at || '');
          const isTransfer =
            rawValues.type == TransactionType.TRANSFER && !!accountId2;
          const oneSecondOlder = new Date(now.getTime() - 1000);
          const firstTransactionDate = isTransfer ? oneSecondOlder : now;

          transactionCreate({
            type: TransactionType.DEBIT,
            ...submitObject,
            transfer: isTransfer,
            created_at: firstTransactionDate,
            updated_at: firstTransactionDate,
          });

          if (isTransfer && !!accountId2) {
            transactionCreate({
              ...submitObject,
              type: TransactionType.CREDIT,
              account_id: accountId2,
              transfer: isTransfer,
              created_at: now,
              updated_at: now,
            });
          }
        } else {
          transactionUpdate({
            newTransaction: {
              ...params?.defaultValues,
              ...submitObject,
            } as TransactionGet,
            previousTransaction: params?.defaultValues as TransactionGet,
          });
        }
      },
    }
  );

  const [filteredCats, setFilteredCats] = useState(categories);

  useEffect(() => {
    const transactionType = form.values.type;

    if (transactionType == TransactionType.CREDIT) {
      const creCats = categories?.filter((c) => c.type == CategoryType.CREDIT);
      setFilteredCats(creCats);
    }

    if (transactionType == TransactionType.DEBIT) {
      const debCats = categories?.filter((c) => c.type == CategoryType.DEBIT);
      setFilteredCats(debCats);
    }

    if (transactionType == TransactionType.TRANSFER) {
      if (form.values.category_id) {
        form.setFieldValue('category_id', '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, form.values.type]);

  return {
    form,
    submitted,
    handleSubmit,
    categories: filteredCats,
    accounts,
    accountId2,
    setaccountId2,
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
