import { hasLength } from '@mantine/form';
import { useCategoryActions } from '../actions/category';
import { useFormBase } from '../form';
import { CategoryGet } from '@repo/types/models/category';
import { CategoryType } from '@repo/types/models/enums';

export const useFormCategory = (params?: {
  defaultValues?: Partial<CategoryGet>;
}) => {
  const { categoryCreate, categoryUpdate } = useCategoryActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<CategoryGet>>(
    {
      title: params?.defaultValues?.title || '',
      type: (params?.defaultValues?.type || CategoryType.DEBIT) as any,
    },
    {
      title: hasLength(
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
          categoryCreate(rawValues);
        } else {
          categoryUpdate({
            ...params?.defaultValues,
            ...rawValues,
          } as CategoryGet);
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
