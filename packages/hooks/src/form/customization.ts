import { hasLength } from '@mantine/form';
import { useFormBase } from '../form';
import { CustomizationGet } from '@repo/types/models/customization';
import { useCustomizationActions } from '../actions/customization';

export const useFormCustomization = (params?: {
  defaultValues?: Partial<CustomizationGet>;
}) => {
  const { customizationCreate, customizationUpdate } =
    useCustomizationActions();

  const { form, submitted, handleSubmit } = useFormBase<
    Partial<CustomizationGet>
  >(
    {
      active: params?.defaultValues?.active || false,
      nickname: params?.defaultValues?.nickname || '',
      occupation: params?.defaultValues?.occupation || '',
      partialities: params?.defaultValues?.partialities || '',
      traits: params?.defaultValues?.traits || '',
    },
    {
      nickname: hasLength({ max: 24 }, 'Max 24 characters'),
      occupation: hasLength({ max: 24 }, 'Max 24 characters'),
      partialities: hasLength({ max: 2048 }, 'Max 2048 characters'),
      traits: hasLength({ max: 2048 }, 'Max 2048 characters'),
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
          customizationCreate({
            ...submitObject,
          });
        } else {
          customizationUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as CustomizationGet);
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
