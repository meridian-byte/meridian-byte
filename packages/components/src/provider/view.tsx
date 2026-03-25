import React from 'react';
import ModalTaskCrud from '../common/modals/task/crud';
import ModalNoteCrud from '../common/modals/note/crud';
import ModalConfirm from '../common/modals/confirm';

export default function View({ children }: { children: React.ReactNode }) {
  return (
    <ModalConfirm options={{ global: true }}>
      <ModalTaskCrud>
        <ModalNoteCrud options={{ global: true }}>{children}</ModalNoteCrud>
      </ModalTaskCrud>
    </ModalConfirm>
  );
}
