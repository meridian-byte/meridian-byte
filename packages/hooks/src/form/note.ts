import { hasLength } from '@mantine/form';
import { useNoteActions } from '../actions/note';
import { useFormBase } from '../form';
import { NoteGet } from '@repo/types/models/note';

export const useFormNote = (params?: {
  defaultValues?: Partial<NoteGet>;
  close?: () => void;
}) => {
  const { noteCreate, noteUpdate } = useNoteActions();

  const { form, submitted, handleSubmit } = useFormBase<Partial<NoteGet>>(
    {
      title: params?.defaultValues?.title || '',
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
          noteCreate(rawValues);
        } else {
          noteUpdate({
            ...params?.defaultValues,
            ...rawValues,
          } as NoteGet);
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
