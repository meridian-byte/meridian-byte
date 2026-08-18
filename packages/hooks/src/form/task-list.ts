import { hasLength, UseFormReturnType } from '@mantine/form';
import { useTaskListActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { TaskListGet } from '@repo/types';
import { useAppshellChild } from '../appshell';
import { getRandomColorName } from '@repo/constants';
import { useViewModal } from '@repo/store';

export type FormTaskListValues = {
  id: string;
  servings: TaskListGet[];
};

export type FormTaskList = UseFormReturnType<Partial<FormTaskListValues>>;

export const useFormTaskList = (params?: {
  defaultValues?: Partial<TaskListGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { taskListCreate, taskListUpdate } = useTaskListActions();

  const { closeModalView } = useViewModal();

  const { form, submitted, handleSubmit } = useFormBase<Partial<TaskListGet>>(
    {
      title: params?.defaultValues?.title || '',
      description: params?.defaultValues?.description || '',
      color: params?.defaultValues?.color || getRandomColorName(),
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
          taskListCreate({
            ...submitObject,
          });
        } else {
          taskListUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as TaskListGet);
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
