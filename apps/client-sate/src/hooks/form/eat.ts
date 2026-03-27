import { useEatActions } from '../actions/eat';
import { useFormBase } from '../form';
import { EatRelations } from '@repo/types/models/eat';

export const useFormEat = (params?: {
  defaultValues?: Partial<EatRelations>;
}) => {
  const { eatCreate, eatUpdate } = useEatActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<EatRelations>>(
    {
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

        if (!params?.defaultValues) {
          eatCreate({
            ...submitObject,
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
