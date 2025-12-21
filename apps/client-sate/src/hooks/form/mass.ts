import { useMassActions } from '../actions/mass';
import { useFormBase } from '../form';
import { MassGet } from '@repo/types/models/mass';

export const useFormMass = (params?: { defaultValues?: Partial<MassGet> }) => {
  const { massCreate, massUpdate } = useMassActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<MassGet>>(
    {
      created_at:
        params?.defaultValues?.created_at || (new Date().toISOString() as any),
      weight: params?.defaultValues?.weight || 0,
      fat: params?.defaultValues?.fat || 0,
      visceral_fat: params?.defaultValues?.visceral_fat || 0,
      lean_weight: params?.defaultValues?.lean_weight || 0,
      muscle: params?.defaultValues?.muscle || 0,
      bone: params?.defaultValues?.bone || 0,
      water: params?.defaultValues?.water || 0,
      bmi: params?.defaultValues?.bmi || 0,
      bmr: params?.defaultValues?.bmr || 0,
    },
    {
      weight: (value) =>
        (value || 0) < 1 ? 'Weight value required' : undefined,
      fat: (value) => ((value || 0) < 1 ? 'Fat value required' : undefined),
      visceral_fat: (value) =>
        (value || 0) < 1 ? 'Visceral fat value required' : undefined,
      lean_weight: (value) =>
        (value || 0) < 1 ? 'Lean weight value required' : undefined,
      muscle: (value) =>
        (value || 0) < 1 ? 'Muscle value required' : undefined,
      bone: (value) => ((value || 0) < 1 ? 'Bone value required' : undefined),
      water: (value) => ((value || 0) < 1 ? 'Water value required' : undefined),
      bmi: (value) => ((value || 0) < 1 ? 'BMI value required' : undefined),
      bmr: (value) => ((value || 0) < 1 ? 'BMR value required' : undefined),
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
          massCreate({
            ...params?.defaultValues,
            ...submitObject,
          });
        } else {
          massUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as MassGet);
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
