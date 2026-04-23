'use client';

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import FormWorkspace from '../../../form/workspace';
import LayoutModal from '../../../layout/modal';
import { WorkspaceGet } from '@repo/types/models/workspace';
import { WorkspaceType } from '@repo/types/models/enums';

export default function Crud({
  workspace,
  children,
}: {
  workspace?: Omit<Partial<WorkspaceGet>, 'type'> & { type: WorkspaceType };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleClose = () => {
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={handleClose}>
        <LayoutModal
          props={{
            title: `${!workspace?.updated_at ? 'Add' : 'Edit'} Workspace`,
            close: handleClose,
          }}
        >
          <FormWorkspace
            props={{ defaultValues: workspace, close: handleClose }}
          />
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
