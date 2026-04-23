import { hasLength } from '@mantine/form';
import { useWorkspaceActions } from '../actions/workspace';
import { useFormBase } from '../form';
import { WorkspaceGet } from '@repo/types/models/workspace';
import { WorkspaceType } from '@repo/types/models/enums';
import {
  saveToLocalStorage,
  saveToSessionStorage,
} from '@repo/utilities/storage';
import { LOCAL_STORAGE_NAME } from '@repo/constants/names';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export const useFormWorkspace = (params?: {
  defaultValues?: Omit<Partial<WorkspaceGet>, 'type'> & { type: WorkspaceType };
  close?: () => void;
}) => {
  const { workspaceCreate, workspaceUpdate } = useWorkspaceActions();
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);

  const { form, submitted, handleSubmit } = useFormBase<
    Omit<Partial<WorkspaceGet>, 'type'> & { type: WorkspaceType }
  >(
    {
      title: params?.defaultValues?.title || '',
      type: (params?.defaultValues?.type || '') as WorkspaceType,
    },
    {
      title: hasLength(
        { min: 2, max: 98 },
        'Between 2 and 98 characters required'
      ),
    },
    {
      resetOnSuccess: false,
      hideSuccessNotification: true,
      clientOnly: false,

      onSubmit: async (rawValues) => {
        if (!params?.defaultValues?.updated_at) {
          const newWorkspace = workspaceCreate(rawValues);

          if (newWorkspace) {
            // save new active workspace to local storage
            saveToLocalStorage(
              LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE,
              newWorkspace.id
            );

            // save new active workspace to session storage
            saveToSessionStorage(
              LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE,
              newWorkspace.id
            );

            // set new global active workspace state
            setActiveItems({ workspace: newWorkspace });
          }
        } else {
          const updatedWorkspace = {
            ...params?.defaultValues,
            ...rawValues,
          } as WorkspaceGet;

          workspaceUpdate(updatedWorkspace);

          // update global active workspace state
          setActiveItems({ workspace: updatedWorkspace });
        }

        if (params?.close) params.close();
      },
    }
  );

  return {
    form,
    submitted,
    handleSubmit,
  };
};
