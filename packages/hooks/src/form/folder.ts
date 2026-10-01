import { hasLength, UseFormReturnType } from '@mantine/form';
import { useFolderActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { FolderGet } from '@repo/types';
import { useAppshellChild } from '../appshell';
import { getUniqueColor } from '@repo/constants';
import { useViewModal } from '@repo/store';

export type FormFolderValues = {
  id: string;
  servings: FolderGet[];
};

export type FormFolder = UseFormReturnType<Partial<FormFolderValues>>;

export const useFormFolder = (params?: {
  defaultValues?: Partial<FolderGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { folderCreate, folderUpdate } = useFolderActions();

  const { closeModalView } = useViewModal();

  const { form, submitted, handleSubmit } = useFormBase<Partial<FolderGet>>(
    {
      name: params?.defaultValues?.name || '',
    },
    {
      name: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters required'),
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
          folderCreate({
            ...submitObject,
          });
        } else {
          folderUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as FolderGet);
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
