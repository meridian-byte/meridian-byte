'use client';

import { Modal } from '@mantine/core';
import React from 'react';
import { useViewModal } from '@repo/store';
import { MODAL_VIEW_NAMES } from '@repo/constants';

export default function Search({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView } = useViewModal();

  return (
    <>
      <Modal
        opened={modalViewValue === MODAL_VIEW_NAMES.SEARCH}
        onClose={closeModalView}
        centered={false}
      >
        <div>global search</div>
      </Modal>

      <span>{children}</span>
    </>
  );
}
