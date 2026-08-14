import { hasLength, UseFormReturnType } from '@mantine/form';
import { useNoteActions, useStoreAppShell } from '@repo/store';
import { useFormBase } from '../form';
import { NoteGet } from '@repo/types';
import { useAppshellChild } from '../appshell';
import { useViewModal } from '@repo/store';

export type FormNoteValues = {
  id: string;
  servings: NoteGet[];
};

export type FormNote = UseFormReturnType<Partial<FormNoteValues>>;

export const useFormNote = (params?: {
  defaultValues?: Partial<NoteGet>;
  options?: { closeWhenDone?: boolean };
}) => {
  const appshell = useStoreAppShell((s) => s.appshell);
  const { handleToggleChildAside } = useAppshellChild();

  const { noteCreate, noteUpdate } = useNoteActions();

  const { closeModalView } = useViewModal();

  const { form, submitted, handleSubmit } = useFormBase<Partial<NoteGet>>(
    {
      title: params?.defaultValues?.title || '',
      content: params?.defaultValues?.content || '',
    },
    {
      title: hasLength({ min: 2, max: 24 }, 'Between 2 and 24 characters required'),
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
          noteCreate({
            ...submitObject,
          });
        } else {
          noteUpdate({
            ...params?.defaultValues,
            ...submitObject,
          } as NoteGet);
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
