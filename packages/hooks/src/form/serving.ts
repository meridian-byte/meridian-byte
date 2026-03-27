import { hasLength } from '@mantine/form';
import { useServingActions } from '../actions/serving';
import { useFormBase } from '../form';
import { ServingGet } from '@repo/types/models/serving';
import { WeightUnitType } from '@repo/types/models/enums';
import { useStoreFood } from '@repo/libraries/zustand/stores/food';
import { FormEat } from './eat';

export const useFormServing = (params?: {
  defaultValues?: Partial<ServingGet>;
  options?: { meal?: boolean };
  formEat?: FormEat;
}) => {
  const { servingCreate, servingUpdate } = useServingActions({
    formEat: params?.formEat,
  });

  const { foods } = useStoreFood();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ServingGet>>(
    {
      serving_size: params?.defaultValues?.serving_size || 100,
      serving_unit: params?.defaultValues?.serving_unit || WeightUnitType.GRAMS,
      food_id: params?.defaultValues?.food_id || '',
      meal_id: params?.defaultValues?.meal_id || '',
      eat_id: params?.defaultValues?.eat_id || '',
    },
    {
      serving_size: (value) =>
        (value || 0) < 1 ? 'Serving Size required' : undefined,
      food_id: hasLength({ min: 1 }, 'Please select a food'),
      meal_id: !params?.options?.meal
        ? undefined
        : hasLength({ min: 1 }, 'Please select a meal'),
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
          servingCreate({
            ...params?.defaultValues,
            ...submitObject,
          });
        } else {
          servingUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as ServingGet);
        }
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
    foods,
  };
};
