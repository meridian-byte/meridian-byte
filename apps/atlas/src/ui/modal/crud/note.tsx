'use client';

import { Group, Modal, Text } from '@mantine/core';
import React from 'react';
import { useViewModal } from '@repo/store';
import { MODAL_VIEW_NAMES } from '@repo/constants';
import FormNote from '@atlas/ui/form/note';
import { extractUuidFromParam } from '@repo/utils';
import { useNoteActions, useStoreNote } from '@repo/store';
import { Alert, NoteGet } from '@repo/types';
import { ButtonConfirmCancel, LayoutModal } from '@repo/ui';

export default function Note({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView, noteObject } = useGetNoteObject();

  return (
    <>
      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.JOT.NOTE.UPDATE)}
        onClose={closeModalView}
      >
        <FormNote defaultValues={noteObject} />
      </Modal>

      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.JOT.NOTE.DELETE)}
        onClose={closeModalView}
      >
        <NoteDelete note={noteObject} onClose={closeModalView} />
      </Modal>

      <span>{children}</span>
    </>
  );
}

const useGetNoteObject = () => {
  const { modalViewValue, closeModalView } = useViewModal();
  const notes = useStoreNote((s) => s.notes);
  const noteId = extractUuidFromParam(modalViewValue || '');
  const noteObject = notes?.find((c) => c.id === noteId);

  return { modalViewValue, closeModalView, noteObject };
};

function NoteDelete({ note, onClose }: { note?: NoteGet; onClose: () => void }) {
  const { noteDelete } = useNoteActions();

  return (
    <LayoutModal props={{ title: 'Delete Note', close: onClose, variant: Alert.WARNING }}>
      <div>
        <Text inherit>
          The note{' '}
          <Text component="em" inherit fw={500}>
            {note?.title}
          </Text>{' '}
          will be deleted. The events in this note will be preserved.
        </Text>

        <Group justify="end" mt={'md'}>
          <ButtonConfirmCancel
            options={{
              onCancel: onClose,
              onConfirm: () => {
                if (note) noteDelete(note);
              },
            }}
          />
        </Group>
      </div>
    </LayoutModal>
  );
}
