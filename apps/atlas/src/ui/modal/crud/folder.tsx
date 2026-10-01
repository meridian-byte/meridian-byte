'use client';

import { Group, Modal, Text } from '@mantine/core';
import React from 'react';
import { useViewModal } from '@repo/store';
import { MODAL_VIEW_NAMES } from '@repo/constants';
import FormFolder from '@atlas/ui/form/folder';
import { extractUuidFromParam } from '@repo/utils';
import { useFolderActions, useStoreFolder } from '@repo/store';
import { Alert, FolderGet } from '@repo/types';
import { ButtonConfirmCancel, LayoutModal } from '@repo/ui';

export default function Folder({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView, folderObject } = useGetFolderObject();

  return (
    <>
      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.FOLDER.UPDATE)}
        onClose={closeModalView}
      >
        <FormFolder defaultValues={folderObject} />
      </Modal>

      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.FOLDER.DELETE)}
        onClose={closeModalView}
      >
        <FolderDelete folder={folderObject} onClose={closeModalView} />
      </Modal>

      <span>{children}</span>
    </>
  );
}

const useGetFolderObject = () => {
  const { modalViewValue, closeModalView } = useViewModal();
  const folders = useStoreFolder((s) => s.folders);
  const folderId = extractUuidFromParam(modalViewValue || '');
  const folderObject = folders?.find((c) => c.id === folderId);

  return { modalViewValue, closeModalView, folderObject };
};

function FolderDelete({ folder, onClose }: { folder?: FolderGet; onClose: () => void }) {
  const { folderDelete } = useFolderActions();

  return (
    <LayoutModal props={{ title: 'Delete Folder', close: onClose, variant: Alert.WARNING }}>
      <div>
        <Text inherit>
          The folder{' '}
          <Text component="em" inherit fw={500}>
            {folder?.name}
          </Text>{' '}
          will be deleted. The events in this folder will be preserved.
        </Text>

        <Group justify="end" mt={'md'}>
          <ButtonConfirmCancel
            options={{
              onCancel: onClose,
              onConfirm: () => {
                if (folder) folderDelete(folder);
                onClose();
              },
            }}
          />
        </Group>
      </div>
    </LayoutModal>
  );
}
