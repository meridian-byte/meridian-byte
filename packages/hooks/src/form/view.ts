import { hasLength } from '@mantine/form';
import { useViewActions } from '../actions/view';
import { useFormBase } from '../form';
import { ViewGet } from '@repo/types/models/view';

export const useFormView = (params?: { defaultValues?: Partial<ViewGet> }) => {
  const { viewCreate, viewUpdate } = useViewActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<ViewGet>>(
    {
      id: params?.defaultValues?.id || '',
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
          viewCreate(rawValues);
        } else {
          viewUpdate({
            ...params?.defaultValues,
            ...rawValues,
          } as ViewGet);
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
