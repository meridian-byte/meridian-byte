import { hasLength } from '@mantine/form';
import { useMealActions } from '../actions/meal';
import { useFormBase } from '../form';
import { MealRelations } from '@repo/types/models/meal';

export const useFormMeal = (params?: {
  defaultValues?: Partial<MealRelations>;
}) => {
  const { mealCreate, mealUpdate } = useMealActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<MealRelations>>(
    {
      name: params?.defaultValues?.name || '',
      description: params?.defaultValues?.description || '',
      servings: params?.defaultValues?.servings || [],
    },
    {
      name: hasLength(
        { min: 2, max: 24 },
        'Between 2 and 24 characters required'
      ),
      // servings: (value) =>
      //   (value || []).length < 1 ? 'At least one is required' : undefined,
    },
    {
      resetOnSuccess: !!params?.defaultValues,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues?.created_at) {
          mealCreate({
            ...submitObject,
          });
        } else {
          mealUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as MealRelations);
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
