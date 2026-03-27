import { hasLength, UseFormReturnType } from '@mantine/form';
import { useTaskActions } from '../actions/task';
import { useFormBase } from '../form';
import { TaskGet } from '@repo/types/models/task';
import { Priority } from '@repo/types/models/enums';

export type FormTask = UseFormReturnType<
  Partial<TaskGet>,
  (values: Partial<TaskGet>) => Partial<TaskGet>
>;

export const useFormTask = (params?: { defaultValues?: Partial<TaskGet> }) => {
  const { taskCreate, taskUpdate } = useTaskActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<TaskGet>>(
    {
      id: params?.defaultValues?.id || '',
      title: params?.defaultValues?.title || '',
      due_date: params?.defaultValues?.due_date || null,
      category_id: params?.defaultValues?.category_id || 'inbox',
      complete: params?.defaultValues?.complete || false,
      description: params?.defaultValues?.description || '',
      priority:
        params?.defaultValues?.priority || Priority.NOT_URGENT_UNIMPORTANT,
      recurring_rule_id: params?.defaultValues?.recurring_rule_id || '',
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
        if (!params?.defaultValues?.updated_at) {
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
