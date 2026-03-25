'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import FormNote from '../../../form/note';
import LayoutModal from '../../../layout/modal';
import { NoteGet } from '@repo/types/models/note';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export default function Crud({
  note,
  options,
  children,
}: {
  note?: NoteGet;
  options?: { global?: boolean };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const activeNote = useStoreActiveItems((s) => s.activeItems?.note);
  const removeActiveNote = useStoreActiveItems((s) => s.removeActiveNote);

  const handleClose = () => {
    if (options?.global) {
      removeActiveNote();
    } else {
      close();
    }
  };

  const workingNote = options?.global && activeNote ? activeNote : note;

  return (
    <>
      <Modal
        opened={options?.global ? !!activeNote : opened}
        onClose={handleClose}
      >
        <LayoutModal
          props={{
            title: `${!activeNote ? 'Create' : 'Edit'} Note`,
            close: handleClose,
          }}
        >
          <FormNote
            props={{ defaultValues: workingNote, close: handleClose }}
          />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
