import { EatTime } from '@repo/types/models/enums';
import { useEatActions } from '../actions/eat';
import { useFormBase } from '../form';
import { EatRelations } from '@repo/types/models/eat';
import { ServingGet } from '@repo/types/models/serving';
import { UseFormReturnType } from '@mantine/form';

export type FormEatValues = {
  id: string;
  servings: ServingGet[];
};

export type FormEat = UseFormReturnType<Partial<FormEatValues>>;

export const useFormEat = (params?: {
  defaultValues?: Partial<EatRelations>;
}) => {
  const { eatCreate, eatUpdate } = useEatActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<EatRelations>>(
    {
      id: params?.defaultValues?.id || '',
      time: params?.defaultValues?.time || EatTime.BREAKFAST,
      servings: params?.defaultValues?.servings || [],
    },
    {
      servings: (value) =>
        (value || []).length < 1 ? 'At least one is required' : undefined,
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues?.created_at) {
          eatCreate({
            ...submitObject,
            ...params?.defaultValues,
          });
        } else {
          eatUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as EatRelations);
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
