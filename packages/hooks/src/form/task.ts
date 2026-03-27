import { hasLength, UseFormReturnType } from '@mantine/form';
import { useTaskActions } from '../actions/task';
import { useFormBase } from '../form';
import { TaskGet } from '@repo/types/models/task';

export type FormTask = UseFormReturnType<
  Partial<TaskGet>,
  (values: Partial<TaskGet>) => Partial<TaskGet>
>;

export const useFormTask = (params?: { defaultValues?: Partial<TaskGet> }) => {
  const { taskCreate, taskUpdate } = useTaskActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<TaskGet>>(
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
          taskCreate(rawValues);
        } else {
          taskUpdate({
            ...params?.defaultValues,
            ...rawValues,
          } as TaskGet);
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
