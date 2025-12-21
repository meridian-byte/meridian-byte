import { hasLength } from '@mantine/form';
import { useFoodActions } from '../actions/food';
import { useFormBase } from '../form';
import { FoodGet } from '@repo/types/models/food';
import { WeightUnitType } from '@repo/types/models/enums';

export const useFormFood = (params?: { defaultValues?: Partial<FoodGet> }) => {
  const { foodCreate, foodUpdate } = useFoodActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<FoodGet>>(
    {
      name: params?.defaultValues?.name || '',
      description: params?.defaultValues?.description || '',
      per: params?.defaultValues?.per || 100,
      per_unit: (params?.defaultValues?.per_unit ||
        WeightUnitType.GRAMS) as any,
      carbs: params?.defaultValues?.carbs || 0,
      protein: params?.defaultValues?.protein || 0,
      fat: params?.defaultValues?.fat || 0,
      kcal: params?.defaultValues?.kcal || 0,
    },
    {
      name: hasLength(
        { min: 2, max: 48 },
        'Between 2 and 48 characters required'
      ),
      description: hasLength({ max: 255 }, 'Max 255 characters required'),
      per: (value) => ((value || 0) < 1 ? 'Unit value required' : undefined),
      carbs: (value) => ((value || 0) < 1 ? 'Carb count required' : undefined),
      protein: (value) =>
        (value || 0) < 1 ? 'Protein count required' : undefined,
      fat: (value) => ((value || 0) < 1 ? 'Fat count required' : undefined),
      kcal: (value) =>
        (value || 0) < 1 ? 'Calorie count required' : undefined,
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updated_at) {
          foodCreate({
            ...params?.defaultValues,
            ...submitObject,
          });
        } else {
          foodUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as FoodGet);
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
