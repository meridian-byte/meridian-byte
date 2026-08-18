import { hasLength, UseFormReturnType } from '@mantine/form';
import { useTaskActions, useStoreAppShell, useSubView, useStoreTaskList } from '@repo/store';
import { useFormBase } from '../form';
import { Priority, TaskGet } from '@repo/types';
import { useAppshellChild } from '../appshell';
import { useViewModal } from '@repo/store';
import { SUBVIEW_NAMES } from '@repo/constants';
import { useEffect } from 'react';
import { extractUuidFromParam, getTomorrow } from '@repo/utils';

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
  const { subViewValue } = useSubView();

  const inboxView = subViewValue === SUBVIEW_NAMES.STRIDE.INBOX;
  const todayView = subViewValue === SUBVIEW_NAMES.STRIDE.TODAY;
  const upcomingView = subViewValue === SUBVIEW_NAMES.STRIDE.UPCOMING;
  const completeView = subViewValue === SUBVIEW_NAMES.STRIDE.COMPLETE;

  const taskListId = extractUuidFromParam(subViewValue || '');

  const { form, submitted, handleSubmit } = useFormBase<Partial<TaskGet>>(
    {
      title: params?.defaultValues?.title || '',
      description: params?.defaultValues?.description || '',
      complete: completeView ? true : (params?.defaultValues?.complete ?? false),
      priority: params?.defaultValues?.priority || Priority.NOT_URGENT_UNIMPORTANT,
      dueDate: todayView
        ? new Date()
        : upcomingView
          ? getTomorrow()
          : params?.defaultValues?.dueDate || null,
      taskListId: inboxView ? null : params?.defaultValues?.taskListId || taskListId || null,
    },
    {
      title: hasLength({ min: 2, max: 512 }, true),
      description: hasLength({ max: 2048 }, true),
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
    views: {
      inboxView,
      todayView,
      upcomingView,
      completeView,
    },
    taskListId,
  };
};
