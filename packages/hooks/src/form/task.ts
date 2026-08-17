import { hasLength, UseFormReturnType } from '@mantine/form';
import { useTaskActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { Priority, TaskGet } from '@repo/types';
import { useAppshellChild } from '../appshell';
import { useViewModal } from '@repo/store';

export type FormTaskValues = {
  id: string;
  servings: TaskGet[];
};

export type FormTask = UseFormReturnType<Partial<FormTaskValues>>;

export const useFormTask = (params?: {
  defaultValues?: Partial<TaskGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { taskCreate, taskUpdate } = useTaskActions();

  const { closeModalView } = useViewModal();

  const { form, submitted, handleSubmit } = useFormBase<Partial<TaskGet>>(
    {
      title: params?.defaultValues?.title || '',
      description: params?.defaultValues?.description || '',
      complete: params?.defaultValues?.complete ?? false,
      priority: params?.defaultValues?.priority || Priority.NOT_URGENT_UNIMPORTANT,
      dueDate: params?.defaultValues?.dueDate || null,
      taskListId: params?.defaultValues?.taskListId || null,
    },
    {
      title: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters required'),
      description: hasLength({ max: 255 }, 'Maximum of 255 characters required'),
    },
    {
      resetOnSuccess: true,
      hideSuccessNotification: true,
      clientOnly: true,

      onSubmit: async (rawValues) => {
        const submitObject = {
          ...rawValues,
        };

        if (!params?.defaultValues?.updatedAt) {
          taskCreate({
            ...submitObject,
          });
        } else {
          taskUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as TaskGet);
        }

        if (!params?.defaultValues?.updatedAt) {
          if (params?.options?.closeWhenDone) {
            if (!!appshell) {
              if (appshell.child.aside == true) {
                handleToggleChildAside();
              }
            }
          }
        } else {
          closeModalView();
        }
      },
    },
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
